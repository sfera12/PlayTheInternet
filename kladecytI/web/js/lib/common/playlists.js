define(["common/ptilist", "pti-playlist"], function (Ptilist, Playlist) {
    Playlists.prototype = new Ptilist()
    Playlists.prototype.constructor = Playlists
    Playlists.prototype.parent = Ptilist.prototype
    function Playlists(appendToElementExpression, options) {
        _.isUndefined(appendToElementExpression) || this.init(appendToElementExpression, options)
    }

    Playlists.prototype.jStorageTypeMapping = {
        playlists: {
            sorted: "playlists",
            prefix: "lPlaylist"
        },
        synchronized: {
            sorted: "synchronized",
            prefix: "sPlaylist"
        }
    }

    Playlists.prototype.init = function (appendToElementExpression, options) {
        var me = this
        me.options = _.extend({}, options)
        me.options.elementSplit = "one"
        me.options.jStorageType = _.default(me.options.jStorageType, "playlists")
        me.options.jStorageTypeValues = Playlists.prototype.jStorageTypeMapping[me.options.jStorageType]
        me.parent.init.call(this, appendToElementExpression, me.options)

        //jContainer
        me.jContainer.addClass("pti-action-background")

        //playlist
        me.jPlaylist = $('<div></div>').appendTo(me.jContainer.parent())
        me.initPlaylist = _.once(function() {
            me.playlist = new Playlist(me.jPlaylist,
                {
                    connectWith: "connected-playlist",
                    elementSize: me.options.playlistElementSize,
                    elementSplit: me.options.playlistElementSplit,
                    headerConfigKey: me.options.playlistHeaderConfigKey,
                    execute: [
                        Playlist.prototype.addAction,
                        me.options.playlistTabsGetPlaylist
                    ]
                })
        })
        //playlist

        //click handlers
        me.jContent.on('click', '.pti-sortable-handler.image-div', function(event, ui) {
            var playlistId = me.getPtiElement(this).attr('id')
            me.playlistOpen(playlistId)
        })

        me.jContent.on('click', '.pti-play-all, .pti-add-all', function(event, ui) {
            var $button = $(this), playlistId = me.getPtiElement(this).attr('id')
            var dao = playlist.DAO(playlistId)
            $button.hasClass('pti-play-all') && playlist.emptyContent()
            playlist.addElementsToList(dao.storageObj.data)
            var videoData = _.stringToTypeId(dao.storageObj.data[0])
            $button.hasClass('pti-play-all') && (playerWidget.loadVideo(videoData.type, videoData.id) | playlist.selectVideo( { index: 0}, false  ))
        })

        me.jContent.on('click', '.pti-remove-playlist-dialog', function(event, ui) {
            var $button = $(this);
            $button.addClass('temp-display-none-important')
            $button.siblings().removeClass('temp-display-none-important')
        })
        me.jContent.on('click', '.pti-remove-playlist-yes', function(event, ui) {
            var playlistId = me.getPtiElement(this).attr('id')
            playlist.DAO(playlistId).delete()
        })
        me.jContent.on('click', '.pti-remove-playlist-no', function(event, ui) {
            var $button = $(this), $parent = $button.parent();
            $parent.children().not('.pti-remove-playlist-dialog').addClass('temp-display-none-important')
            $parent.children('.pti-remove-playlist-dialog').removeClass('temp-display-none-important')
        })

        var oldName
        me.jContent.on('focusin', '.pti-name', function() {
            oldName = $(this).val()
        })
        me.jContent.on('focusout', '.pti-name', function() {
            var newName = $(this).val()
            if (oldName !== newName) {
                var playlistId = me.getPtiElement(this).attr('id')
                var dao = playlist.DAO(playlistId).update({ name: newName, source: me.uid }).set()
            }

        })

        me.jContent.on('keypress', '.pti-name', function (event) {
            if (event.keyCode == 13) {
                $(this).blur()
            }
        })
        //click handlers

//        me.redrawJContentFromCacheListen = _.debounce(function (key, action) {
//            me.redrawJContentGeneric(key, action, 'listener redraw playlists from cache', true)
//        }, 50)
        me.setIdListen(me.options.jStorageTypeValues.sorted, "*")
    }

    Playlists.prototype.drawPtiElement = function (playlistData, $ptiElement) {
        $ptiElement.append(PTITemplates.prototype.PlaylistsVideoElement(playlistData))
        return $ptiElement
    }

    Playlists.prototype.redrawJContent = function(storageObject) {
        this.parent.redrawJContent.call(this, storageObject)
        var me = this
        console.log(me.getPtiElements())
        me.getPtiElements().droppable({
            accept: ".pti-element-video",
            drop: function(event, ui) {
                var ids = '', playlistId = this.id, uiselected
                var ptilist = ui.draggable.parent().data('ptilist'), playlistDao = Playlist.prototype.DAO(playlistId)
                if(ui.draggable.hasClass('ui-selected')) {
                    ids = ptilist.getIdsUiSelected()
                    uiselected = ptilist.getPtiElementsUiSelected()
                } else {
                    ids = [ui.draggable[0].id]
                }
                playlistDao.addVideos(ids, { source: "" }).set()


                var remove = function() {
                    $(this).remove();
                }
                ui.draggable.remove()
                uiselected && uiselected.hide(400, remove);
                console.log('songId, playlistId: ', ids, playlistId)
                console.log(event)
                console.log(ui)
                console.log(this)
            },
            hoverClass: "drop-hover"
        })
    }

    Playlists.prototype.redrawJContentGetCacheObject = function (key, action, functionName, filterOwn) {
        var pattern = "^(" + this.options.jStorageTypeValues.sorted + ")|(" + this.options.jStorageTypeValues.prefix + ".+)$"
        if (key.match(pattern)) {  // /^(playlists)|(lPlaylist.+)$/
            var storageObj = this.parent.redrawJContentGetCacheObject.call(this, key, action, functionName, filterOwn)
            if (!_.isUndefined(storageObj)) { //undefined means filtered by source === uid
                var playlists = { data: this.filterJStorageBy(this.typeLocalPlaylist, this.sortLocalPlaylist) }
                return playlists
            }
        }
    }

    Playlists.prototype.synchronizedRedrawJContentGetCacheObject = function (key, action, functionName, filterOwn) {
        var pattern = "^(" + this.options.jStorageTypeValues.sorted + ")|(" + this.options.jStorageTypeValues.prefix + ".+)$"
        if (key.match(pattern)) {  // /^(playlists)|(lPlaylist.+)$/
            var defer = $.Deferred(), me = this
            chrome.storage.sync.get(function (sync) {
                var storageObj = me.parent.redrawJContentGetCacheObject.call(this, key, action, functionName, filterOwn)
                if (!_.isUndefined(storageObj)) { //undefined means filtered by source === uid
                    var playlists = { data: me.filterJStorageBy(me.typeLocalPlaylist, me.sortLocalPlaylist, sync.user_id) }
                    defer.resolve(playlists)
                } else {
                    defer.resolve()
                }
            })
            return defer
        }
    }

    Playlists.prototype.playlistClose = function() {
        this.jContainer.removeClass('temp-display-none')
    }

    Playlists.prototype.playlistOpen = function(id) {
        this.initPlaylist()
        this.playlist.setIdListen(id)
        this.jContainer.addClass('temp-display-none')
    }

    Playlists.prototype.filterJStorageBy = function(filter, sort) {
        var storageObj = $.jStorage.storageObj(), jStorageKeys = Object.keys(storageObj.__proto__), resultArr = new Array(), resultKeys = new Array(), me = this
        //filter
        resultKeys = jStorageKeys.filter(function(key) {
            return key.match("^" + me.options.jStorageTypeValues.prefix)
        })
        //filter end
        //sort
//      resultKeys = sort(storageObj, resultKeys)
        var sortedPlaylistIds, playlistsOrder = storageObj[this.options.jStorageTypeValues.sorted] ? _.stringToArray(storageObj[this.options.jStorageTypeValues.sorted].data) : [], newKeys = _.difference(resultKeys, playlistsOrder)
        newKeys.reverse()
        sortedPlaylistIds = newKeys.concat(playlistsOrder)
        resultKeys = sortedPlaylistIds
        //sort end
        resultKeys.forEach(function (key) {
            if(storageObj[key]) {
                var item = _.extend({}, storageObj[key]);
                item.data = _.stringToArray(item.data)
                resultArr.push(item)
            }
        })
        return resultArr
    }

    Playlists.prototype.synchronizedFilterJStorageBy = function(filter, sort, userId) {
        var storageObj = $.jStorage.storageObj(), jStorageKeys = Object.keys(storageObj.__proto__), resultArr = new Array(), resultKeys = new Array(), me = this
        //filter
        resultKeys = jStorageKeys.filter(function(key) {
            return key.match("^" + me.options.jStorageTypeValues.prefix)
        })
        //filter end
        //sort
//      resultKeys = sort(storageObj, resultKeys)
        var sortedPlaylistIds, playlistsOrder = storageObj[this.options.jStorageTypeValues.sorted] ? _.stringToArray(storageObj[this.options.jStorageTypeValues.sorted].data) : [], newKeys = _.difference(resultKeys, playlistsOrder)
        newKeys.reverse()
        sortedPlaylistIds = newKeys.concat(playlistsOrder)
        resultKeys = sortedPlaylistIds
        //sort end
        resultKeys.forEach(function (key) {
            if(storageObj[key]) {
                var item = _.extend({}, storageObj[key]);
                item.data = _.stringToArray(item.data)
                item.user_id == userId && resultArr.push(item)
            }
        })
        return resultArr
    }

//    Playlists.prototype.typeLocalPlaylist = function(key) {
//        return key.match("^" + this.options.jStorageTypeValues.prefix)
//    }

//    Playlists.prototype.sortLocalPlaylist = function(storageObj, filteredKeys) {
//        var sortedPlaylistIds, playlistsOrder = storageObj[this.options.jStorageTypeValues.sorted] ? _.stringToArray(storageObj[this.options.jStorageTypeValues.sorted].data) : [], newKeys = _.difference(filteredKeys, playlistsOrder)
//        newKeys.reverse()
//        sortedPlaylistIds = newKeys.concat(playlistsOrder)
//        return sortedPlaylistIds
//    }

    return Playlists
})