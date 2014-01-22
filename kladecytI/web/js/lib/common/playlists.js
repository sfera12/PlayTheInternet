define(["common/ptilist", "pti-playlist"], function (Ptilist, Playlist) {
    Playlists.prototype = new Ptilist()
    Playlists.prototype.constructor = Playlists
    Playlists.prototype.parent = Ptilist.prototype
    function Playlists(appendToElementExpression, options) {
        _.isUndefined(appendToElementExpression) || this.init(appendToElementExpression, options)
    }

    Playlists.prototype.init = function (appendToElementExpression, options) {
        var me = this
        me.options = _.extend({}, options)
        me.options.elementSplit = "one"
        me.parent.init.call(this, appendToElementExpression, me.options)

        //playlist
        me.jPlaylist = $('<div></div>').appendTo(me.jContainer.parent())
        me.initPlaylist = _.once(function() {
            me.playlist = new Playlist(me.jPlaylist, { connectWith: "connected-playlist"})
        })
        //playlist

        //click handlers
        me.jContent.on('click', '.pti-sortable-handler.image-div', function(event, ui) {
            var playlistId = $(this).parents('.pti-element').attr('id')
            me.playlistOpen(playlistId)
        })

        me.jContent.on('keypress', '.pti-name', function (event) {
            if (event.keyCode == 13) {
                $(this).blur()
            }
        })
        //click handlers

        me.redrawJContentFromCacheListen = _.debounce(function (key, action) {
            me.redrawJContentGeneric(key, action, 'listener redraw playlists from cache', true)
        }, 50)
        me.setIdListen("playlists", "*")
    }

    Playlists.prototype.drawPtiElement = function (playlistData) {
        var ptiElement = $(PTITemplates.prototype.PlaylistsVideoElement(playlistData))
        ptiElement.data('data', playlistData)
        return ptiElement
    }

    Playlists.prototype.redrawJContentGetCacheObject = function (key, action, functionName, filterOwn) {
        if (key.match(/^(playlists)|(lPlaylist.+)$/)) {
            var storageObj = this.parent.redrawJContentGetCacheObject.call(this, "playlists", action, functionName, filterOwn ? key.match(/^playlists$/) : false)
            if (!_.isUndefined(storageObj)) { //undefined means filtered by source === uid
                var playlists = _.extend({}, storageObj)
                playlists.data = filterJStorageBy(typeLocalPlaylist, sortLocalPlaylist)
                return playlists
            }
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

    function filterJStorageBy(filter, sort) {
        var storageObj = $.jStorage.storageObj(), jStorageKeys = Object.keys(storageObj.__proto__), resultArr = new Array(), resultKeys = new Array()
        resultKeys = jStorageKeys.filter(filter)
        resultKeys = sort(storageObj, resultKeys)
        resultKeys.forEach(function (key) {
            var item = _.extend({}, storageObj[key]);
            item.data = Ptilist.prototype.stringToArray(item.data)
            item && resultArr.push(item)
        })
        return resultArr
    }

    function typeLocalPlaylist(key) {
        return key.match(/^lPlaylist/)
    }

    function sortLocalPlaylist(storageObj, filteredKeys) {
        var sortedPlaylistIds, playlistsOrder = storageObj.playlists ? Ptilist.prototype.stringToArray(storageObj.playlists.data) : [], newKeys = _.difference(filteredKeys, playlistsOrder)
        newKeys.reverse()
        sortedPlaylistIds = newKeys.concat(playlistsOrder)
        return sortedPlaylistIds
    }

    return Playlists
})