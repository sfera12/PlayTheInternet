define(["common/ptilist"], function (Ptilist) {
    Playlist.prototype = new Ptilist()
    Playlist.prototype.constructor = Playlist
    Playlist.prototype.parent = Ptilist.prototype
    function Playlist(appendToElementExpression, options) {
        _.isUndefined(appendToElementExpression) || this.init(appendToElementExpression, options)
    }

    Playlist.prototype.init = function (appendToElementExpression, options) {
        var me = this
        me.options = _.extend({}, options)
        me.options.ptiElementClass = "pti-element-video " + _.default(me.options.ptiElementClass, "")
        me.options.fillVideoElement = _.default(me.options.fillVideoElement, true)
        me.options.playerType = _.default(me.options.playerType, false)
        me.parent.init.call(this, appendToElementExpression, me.options)

        if(options.execute && options.execute.length) {
            options.execute.forEach(function(item) {
                _.isFunction(item) && item.call(me)
            })
        }
    }

    Playlist.prototype.addAction = function () {
        Playlist.prototype.setActionBackground.call(this)
        this.jContainer.addClass('pti-action-add')
        this.jContainer.addClass('pti-action-play')
        var me = this
        this.jContent.on('click', '.pti-element', function (event) {
            if ($(event.target).prop('tagName').match(/^[aA]$/) == null) {
                var selected = '', $this = $(this), uiselected
                if ($this.hasClass('ui-selected')) {
                    selected = me.getIdsUiSelected()
                    uiselected = me.getPtiElementsUiSelected().not($this)
                    uiselected.remove()
                } else {
                    selected = [this.id]
                }
//            console.log(selected)
                me.tabsGetPlaylist().addElementsToList(selected, true)
                var remove = function() {
                    $(this).remove();
                    me.recalculateJContentImmediate()
                }
                $this.hide(400, remove);
            }
        })
    }

    Playlist.prototype.buildHash= function() {
        return '#' + this.getIds()
    }

    Playlist.prototype.createHeader = function () {
        var me = this
        var $out = $('<div class="pti-header"/><div class="pti-menu temp-display-none"/>'), $header = $out.eq(0), $menu = $out.eq(1)
        var groupToReplace = { '.size-button': /pti-view-[^\s]+/, '.split-button': /pti-split-[^\s]+/ }
        if(me.options.headerConfigKey) {
            var conf = $.jStorage.get(me.options.headerConfigKey)
            conf && conf.size && ( me.options.elementSize = conf.size )
            conf && conf.split && ( me.options.elementSplit = conf.split )
        }
        var setSizeActive = function(selected) {
            var $selected = $(this);
            $selected.addClass('selected')
            var classes = $selected.attr('class').split(' ')
            var sizeClass = classes[0].replace(/set/, 'pti')
            var groupClass = '.' + classes[2]
            $header.find(groupClass).not(this).removeClass('selected')
            var before = { scrollTop: me.jContent.scrollTop(), scrollHeight: me.jContent.prop('scrollHeight'), height: me.jContent.height() }
            me.jContent.attr('class', function (i, c) {
                return (c.replace(groupToReplace[groupClass], sizeClass))
            })
            var after = { scrollTop: me.jContent.scrollTop(), scrollHeight: me.jContent.prop('scrollHeight'), height: me.jContent.height() }
            moveScrollBar(before, after)
            me.options.headerConfigKey && headerClick($selected)
        }
        var moveScrollBar = function(before, after) {
            var beforeScrollTop = before.scrollTop / (before.scrollHeight - before.height)
            var afterScrollTop = (after.scrollHeight - after.height) * beforeScrollTop
            me.jContent.slimscroll({scrollTo:  afterScrollTop + 'px' })
        }
        var headerClick = function(ui) {
            var options = { size: undefined, split: undefined }
            ui.parent().find('.selected').each(function (index, item) {
                var classes = $(item).attr('class').split(' ')
                var size = classes[0].replace(/set-\w+-/, '')
                if (classes[2].match(/size/)) {
                    options.size = size
                } else if (classes[2].match(/split/)) {
                    options.split = size
                }
            })
            $.jStorage.set(me.options.headerConfigKey, options)
        }

        var createPlaylistDialogToggle = function() {
            if(!$addPlaylist.hasClass('selected')) {
                $addPlaylist.addClass('selected')
                createPlaylistDialog()
            } else {
                closeCreatePlaylistDialog()
            }
        }

        var createPlaylistCloseTimeout
        var createPlaylistDialog = function() {
            $menu.removeClass('temp-display-none')
            $input.focus()
        }
        var closeCreatePlaylistDialog = function() {
            clearTimeout(createPlaylistCloseTimeout)
            $addPlaylist.removeClass('selected')
            $menu.addClass('temp-display-none')
            $input.prop('disabled', false)
            $input.val('')
            $input.css('color', "")
        }

        var createPlaylistHandler = _.throttle(function() {
            $input.prop('disabled', true)
            createPlaylist()
            $input.val('Playlist created')
            $input.css('color', 'green')
            createPlaylistCloseTimeout = setTimeout(function() {
                closeCreatePlaylistDialog()
            }, 2000)
        }, 2000, { trailing: false })

        var createPlaylist = function() {
            var name = $input.val()
            var radio = $menu.find('input[type="radio"]:checked').parent().text()
            var type = radio.match('Playlist') ? 'l' : 's'
            var id = type + "Playlist" + _.guid()
            var selected = me.getIdsUiSelected(), playlist = selected.length ? selected : me.getIds()
            var thumbnail = SiteHandlerManager.prototype.getThumbnail( playlist.length ? playlist[0] : "" )
            var dao = Playlist.prototype.DAO(id).addVideos(playlist, { name: name, thumbnail: thumbnail})
            dao.set()
        }

        var inputHandler = function(event) {
            if(event.keyCode == 13) {
                createPlaylistHandler()
            }
        }

        var bigView = $('<div class="set-view-big pti-header-button size-button">L</div>').appendTo($header).click(setSizeActive)
        var mediumView = $('<div class="set-view-medium pti-header-button size-button">M</div>').appendTo($header).click(setSizeActive)
        var listView = $('<div class="set-view-list pti-header-button size-button">S</div>').appendTo($header).click(setSizeActive)
        var splitOne = $('<div class="set-split-one pti-header-button split-button temp-playlist-header-margin-left">1</div>').appendTo($header).click(setSizeActive)
        var splitTwo = $('<div class="set-split-two pti-header-button split-button">2</div>').appendTo($header).click(setSizeActive)
        var $addPlaylist = $('<div class="pti-header-button temp-playlist-header-margin-left">+</div>').appendTo($header).click(createPlaylistDialogToggle)
        $header.find("[class*=set-view-" + me.options.elementSize + "]").addClass('selected')
        $header.find("[class*=set-split-" + me.options.elementSplit + "]").addClass('selected')

        //menu start
        var createRadio = function(label, group, checked) {
            var guid = _.guid()
            return $('<label for="' + guid + '" class="squaredTwo"> <input id="' + guid + '" class="max-width" type="radio" name="' + group + '" checked="' + checked + '"/> <label for="' + guid +'"></label>'+ label +'</label>')
        }
        var $input = $('<input type="text" class="create-playlist-name" placeholder="Playlist name to create"/>').appendTo($menu).keypress(inputHandler)
        var group = _.guid()
        $menu.append(createRadio('Playlist', group))
        $menu.append(createRadio('Synchronized', group, "checked"))
        var $create = $('<input type="button" class="btn btn-primary" value="Create"/>').appendTo($menu).click(createPlaylistHandler)

        return $out
    }

    Playlist.prototype.drawPtiElement = function(typeIdText, $ptiElement) {
        return SiteHandlerManager.prototype.drawPtiElement(typeIdText, $ptiElement, this.options.fillVideoElement)
    }

    Playlist.prototype.DAO = function(key) {
        var obj = $.jStorage.get(key)
        var storageObj = _.extend({ id: key }, obj)
        storageObj.data = _.stringToArray(storageObj.data)
        return dao = {
            key: key,
            storageObj: storageObj,
            addVideos: function(videosArr, extend) {
                this.storageObj.data = this.storageObj.data.concat(videosArr)
                _.isUndefined(extend) ||  this.update(extend)
                return this
            },
            delete: function() {
                $.jStorage.deleteKey(this.key)
                $.jStorage.deleteKey("selected_" + this.key)
                return this
            },
            exists: function() {
                return Boolean(obj)
            },
            update: function (obj, update) {
                _.default(update, true) && _.extend(obj, { updated: Date.now() })
                _.extend(this.storageObj, obj)
                return this
            },
            serialize: function() {
                this.storageObj.data = _.arrayToString(this.storageObj.data)
                return this
            },
            set: function (serialize) {
                _.default(serialize, true) && this.serialize()
                $.jStorage.set(this.key, this.storageObj)
                console.log('set', this.storageObj)
                return this
            }
        }
    }

    Playlist.prototype.getSelectedVideoDiv = function() {
        return this.jContent.find('.selected')
    }

    Playlist.prototype.getSelectedVideoIndex = function() {
        return this.getPtiElements().index(this.getSelectedVideoDiv())
    }

    Playlist.prototype.getVideoDivAndData = function (video) {
        console.log(video)
        var videoDiv
        var videoData
        var songs = this.getPtiElements();
        if(video && video.index >= 0) {
            videoDiv = songs[video.index]
            videoData = $(videoDiv).data('data')
            return {videoData:videoData, videoDiv:videoDiv, index:video.index}
        }
        if(video && video.videoDiv) {
            var index = songs.index(video.videoDiv)
            videoData = $(video.videoDiv).data('data')
            return {videoData:videoData, videoDiv:video.videoDiv, index:index}
        }
        if(video && video.videoData) {
            for(var index=0; index<songs.length; index++) {
                var vf = $(songs[index]).data('data')
                if(vf.type == video.videoData.type && vf.id == video.videoData.id) {
                    return {videoData:vf, videoDiv:songs[index], index:index}
                }
            }
        }
        if (!videoData) {
            throw "videoData or video is empty in getVideoDivAndData"
        }
    }

    Playlist.prototype.listenPlaySelectedVideo = function (key, action) {
        var storageData = this.redrawJContentGetCacheObject(key, action, 'listen play selected video', true)
        storageData && storageData.play && storageData.index >= 0 && this.playVideo({ index: storageData.index }, storageData.playerState, false)
    }

    Playlist.prototype.lookupNextSong = function () {
        var index = this.getSelectedVideoIndex()
        index = index >= this.getIdsCount() - 1 ? 0 : ++index
        return this.getPtiElements()[index]
    }

    Playlist.prototype.lookupPrevSong = function () {
        var index = this.getSelectedVideoIndex()
        index = index <= 0 ? this.getIdsCount() - 1 : --index
        return this.getPtiElements()[index]
    }

    Playlist.prototype.playAction = function () {
        this.jContainer.addClass('pti-action-play')
        Playlist.prototype.setActionBackground.call(this)
        var me = this
        this.jContent.on('click', '.pti-element', function (event) {
            if ($(event.target).prop('tagName').match(/^[aA]$/) == null) {
                me.playVideo({videoDiv: $(this)})
            }
        })
    }

    Playlist.prototype.playerType = function (boolean) {
        !_.isUndefined(boolean) && (this.options.playerType = boolean)
        return this.options.playerType
    }

    Playlist.prototype.playNextVideo = function () {
        this.playVideo({videoDiv:this.lookupNextSong()})
    }

    Playlist.prototype.playVideo = function(video, playerState, setStorage) {
        console.log(video)
        var videoObject = this.getVideoDivAndData(video)
        this.selectVideo(videoObject, setStorage)
        if (this.playerType()) {
            pti.playing(true)
            SiteHandlerManager.prototype.playVideoData(videoObject.videoData, playerState)
        } else {
            console.log('not a player type')
        }
    }

    Playlist.prototype.recalculateJContentBuildStorageObject = function() {
        var superObject = this.parent.recalculateJContentBuildStorageObject.call(this)
        var storageObject = $.jStorage.get(this.options.id)
        var recalculatedObject = _.extend(storageObject ? storageObject : { name: new Date() }, superObject)
        return recalculatedObject
    }

    Playlist.prototype.recalculateJContentImmediate = function(cache) {
        this.parent.recalculateJContentImmediate.call(this, cache)
        this.options.id && $.jStorage.set('selected_' + this.options.id, { source: this.uid, index: this.getSelectedVideoIndex(), date: Date.now() })
        _.isFunction(this.options.recalculateJContentImmediateCallback) && this.options.recalculateJContentImmediateCallback()
    }

    Playlist.prototype.redrawJContent = function(storageObject, scrollTo) {
        if(storageObject.data) {
            this.parent.redrawJContent.call(this, storageObject, scrollTo)
            var selectedVideo = $.jStorage.get('selected_' + this.options.id)
            selectedVideo && selectedVideo.index >= 0 && this.selectVideo({index: selectedVideo.index}, false)
        }
    }

    Playlist.prototype.scrollToSelected = function() {
        this.parent.scrollTo.call(this, this.getSelectedVideoIndex())
    }

    Playlist.prototype.selectVideo = function (video, setStorage) {
        this.getPtiElements().removeClass("selected")
        var videoObject = this.getVideoDivAndData(video)
        var videoData = videoObject.videoData
        var videoDiv = videoObject.videoDiv
        $(videoDiv).addClass("selected")
        if (this.options.id && _.default(setStorage, true)) {
            console.log('setting currVideoData to storage')
            $.jStorage.set("selected_" + this.options.id, { source:this.uid, index:this.getSelectedVideoIndex(), play: true, date: Date.now() })
        }
//        setWindowTitle(this.currVideoData);
    }

    Playlist.prototype.setActionBackground = function() {
        this.jContainer.addClass('pti-action-background')
    }

    Playlist.prototype.setIdListen = function(id, listenId, scrollTo) {
        this.parent.setIdListen.call(this, id, listenId, scrollTo)
        this.setPlaySelectedVideoListen(id)
    }

    Playlist.prototype.setPlaySelectedVideoListen = function(id) {
        this.listenPlaySelectedVideoLast && $.jStorage.stopListening("selected_" + id, this.listenPlaySelectedVideoLast)
        this.listenPlaySelectedVideoLast = this.listenPlaySelectedVideo.bind(this)
        this.options.id && $.jStorage.listenKeyChange("selected_" + this.options.id, this.listenPlaySelectedVideoLast)
    }

    return Playlist
})