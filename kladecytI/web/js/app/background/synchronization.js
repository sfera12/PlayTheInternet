define(['jstorage', 'underscore', 'pti-playlist'], function (one, two, Playlist) {
    var device_id = $.jStorage.get('device_id') || $.jStorage.set("device_id", _.guid())
    var upsertKeys = {}, deleteKeys = []

    var _upsert = _.throttle(function () {
        chrome.storage.sync.get(function (sync) {
            var start = Date.now()
            var upsert = {}
            console.trace("[%s] [_upsert][sync.get]", start, { sync: sync, synchronizeKeys: upsertKeys})
            for (var key in upsertKeys) {
                var dao = Playlist.prototype.DAO(key)
                delete(upsertKeys[key])
                if (dao.storageObj.updated > (sync[key] ? sync[key].updated : 0)) {
                    dao.update({ device_id: device_id }, false)
                    upsert[key] = dao.serialize().storageObj
                    console.trace("[%s] [_upsert][sync.get][dao.updated > sync.updated] [SET %s TO UPSERT]", start, key, { dao: dao.storageObj, sync: sync[key]})
                } else if (dao.storageObj.updated < sync[key].updated) {
                    dao.storageObj = sync[key]
                    dao.update({ source: "sync" }, false).set(false)
                    console.trace("[%s] [_upsert][sync.get][dao.updated<sync.updated] [OBJECT %s IN JSTORAGE OLDER THAN IN SYNC, UPDATED]", start, key, { dao: dao.storageObj, sync: sync[key]})
                }
            }
            if (_.keys(upsert).length) {
                chrome.storage.sync.set(upsert, function () {
                    chrome.runtime.lastError && (console.log(chrome.runtime.lastError) | alert("OH NOES THERE WAS AN ERROR IN CHROME.SYNC.SET"))
                    _.keys(upsertKeys).length && _upsert()
                    console.trace("[%s] [_upsert][sync.set] and postponed %s upsertKeys [SYNCHRONIZED UPSERT TO CHROME.SYNC]", start, _.keys(upsertKeys).length, { upsert: upsert })
                })
            } else if (upsertKeys.length) {
                _.keys(upsertKeys).length && _upsert()
                console.trace("[%s] [_upsert][nothing to set] and postponed %s upsertKeys", start, _.keys(upsertKeys).length, { synchronizeKeys: upsertKeys })
            }
        })
    }, 7000)

    var _delete = _.throttle(function() {
        var tempDeleteKeys = deleteKeys
        chrome.storage.sync.remove(tempDeleteKeys, function() {
            console.trace("[%s] [_delete] [REMOVED DELETEKEYS FROM CHROME.SYNC]", Date.now(), tempDeleteKeys)
        })
        deleteKeys = []
    }, 10000)

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace == "sync") {
            chrome.storage.sync.get(function (sync) {
                var start = Date.now()
                console.trace("[%s] [chrome.storage.onChanged][sync.get]", start, { changes: changes, sync: sync })
                for (key in changes) {
                    if (key.match(/^((synchronized)|(sPlaylist).*)/)) {
                        var dao = Playlist.prototype.DAO(key)
                        if(!sync[key]) {
                            dao.delete()
                            console.trace("[%s] [chrome.storage.onChanged][sync.get][key.match][!sync] [REMOVED %s FROM JSTORAGE]", start, key, { sync: sync[key], dao: dao.storageObj })
                        } else if (sync[key].device_id != device_id) {
                            dao.storageObj = sync[key]
                            dao.update({ source: "sync" }, false)
                            dao.set(false)
                            console.trace("[%s] [chrome.storage.onChanged][sync.get][key.match][sync.device_id!=device_id] [SET %s TO JSTORAGE]", start, key, { sync: sync[key], device_id: device_id, dao: dao.storageObj })
                        }
                    }
                }
            })
        }
    });

    $.jStorage.listenKeyChange('*', function (key, action) {
        if (key.match(/^((synchronized)|(sPlaylist).*)/)) {
            var dao = Playlist.prototype.DAO(key)
            if (!dao.exists()) {
                deleteKeys.push(dao.key)
                console.trace("[%s] [jStorageListenKeyChange(key.match(/^((synchronized)|(sPlaylist).*)/))&&!dao.exists] [SCHEDULED %s TO DELETEKEYS, INVOKING _delete]", Date.now(), key)
                _delete()
            } else if (dao.storageObj.source != "sync") {
                upsertKeys[key] = action
                console.trace("[%s] [jStorageListenKeyChange(key.match(/^((synchronized)|(sPlaylist).*)/))&&dao.storageObj.source!=sync] [SET %s TO SYNCHRONIZEKEYS, INVOKING _upsert]", Date.now(), key)
                _upsert()
            }
        }
    })
})