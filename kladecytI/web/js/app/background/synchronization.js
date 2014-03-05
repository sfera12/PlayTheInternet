define(['jstorage', 'underscore', 'pti-playlist'], function (one, two, Playlist) {
    var device_id = $.jStorage.get('device_id') || $.jStorage.set("device_id", _.guid())
    var synchronizeKeys = {}

    var _synchronize = _.throttle(function () {
        chrome.storage.sync.get(function (sync) {
            var start = Date.now()
            var upsert = { user_id: sync.user_id || _.guid()}
            console.trace("[%s] [_synchronize][sync.get]", start, { sync: sync, synchronizeKeys: synchronizeKeys})
            for (var key in synchronizeKeys) {
                var dao = Playlist.prototype.DAO(key)
                if (_.isUndefined(dao.storageObj.user_id) || dao.storageObj.user_id == upsert.user_id) { // !dao.storageObj.user_id means newly created obj
                    console.trace("[%s] [_synchronize][sync.get][!dao.storageObj.user_id || dao.user_id == upsert.user_id]", start, { dao: dao.storageObj, upsert: upsert})
                    delete(synchronizeKeys[key])
                    if (dao.storageObj.updated > (sync[key] ? sync[key].updated : 0)) {
                        dao.update({ device_id: device_id, user_id: upsert.user_id }, false)
                        upsert[key] = dao.serialize().storageObj
                        console.trace("[%s] [_synchronize][sync.get][dao.user_id == upsert.user_id][dao.updated > sync.updated] [SET %s TO UPSERT]", start, key, { dao: dao.storageObj, sync: sync[key]})
                    } else if (dao.storageObj.updated < sync[key].updated) {
                        dao.storageObj = sync[key]
                        dao.update({ source: "sync" }, false).set(false)
                        console.trace("[%s] [_synchronize][sync.get][dao.storageObj.updated<sync[key].updated] [OBJECT %s IN JSTORAGE OLDER THAN IN SYNC, UPDATED]", start, key, { dao: dao.storageObj, sync: sync[key]})
                    }
                }
            }
            if (_.keys(upsert).length > 1) {
                chrome.storage.sync.set(upsert, function () {
                    chrome.runtime.lastError && (console.log(chrome.runtime.lastError) | alert("OH NOES THERE WAS AN ERROR IN CHROME.STORAGE.SYNC.SET"))
                    _.keys(synchronizeKeys).length && _synchronize()
                    console.trace("[%s] [_synchronize][sync.set] and postponed %s synchronizeKeys [SYNCHRONIZED UPSERT TO CHROME.SYNC]", start, _.keys(synchronizeKeys).length, { upsert: upsert })
                })
            } else if (synchronizeKeys.length) {
                _.keys(synchronizeKeys).length && _synchronize()
                console.trace("[%s] [_synchronize][nothing to set] and postponed %s synchronizeKeys", start, _.keys(synchronizeKeys).length, { synchronizeKeys: synchronizeKeys })
            }
        })
    }, 6000)

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace == "sync") {
            chrome.storage.sync.get(function (sync) {
                var start = Date.now()
                console.trace("[%s] [chrome.storage.onChanged][sync.get]", start, { sync: sync })
                for (key in changes) {
//                var storageChange = changes[key];
//                console.log('Storage key "%s" in namespace "%s" changed. ' +
//                    'Old value was "%s", new value is "%s".',
//                    key,
//                    namespace,
//                    storageChange.oldValue,
//                    storageChange.newValue);
                    if (key.match(/^((synchronized)|(sPlaylist).*)/)) {
                        console.trace("[%s] [chrome.storage.onChanged][sync.get][key.match(/^((synchronized)|(sPlaylist).*)/)] [MATCHED %s]", start, key, sync)
                        if (sync[key].device_id != device_id) {
                            var storageChange = changes[key];
                            var dao = Playlist.prototype.DAO(key)
                            dao.storageObj = storageChange.newValue
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
        var dao = Playlist.prototype.DAO(key)
        if (key.match(/^((synchronized)|(sPlaylist).*)/) && dao.storageObj.source != "sync") {
            synchronizeKeys[key] = action
            console.trace("[%s] [jStorageListenKeyChange(key.match(/^((synchronized)|(sPlaylist).*)/))&&dao.storageObj.source!=sync] [SET %s TO SYNCHRONIZEKEYS, INVOKING _synchronize]", Date.now(), key)
            _synchronize()
        }
    })
})