define(["common/ptilist", "siteHandlers"], function (Ptilist) {
    Playlist.prototype = new Ptilist()
    Playlist.prototype.constructor = Playlist
    Playlist.prototype.parent = Ptilist.prototype
    function Playlist(appendToElementExpression, options) {
        _.isUndefined(appendToElementExpression) || this.init(appendToElementExpression, options)
    }

    Playlist.prototype.init = function (appendToElementExpression, options) {
        var me = this
        me.options = _.extend({}, options)
        me.parent.init.call(this, appendToElementExpression, me.options)
    }


    Playlist.prototype.createHeader = function () {
        var me = this
        var $header = $('<div class="pti-header"/>')
        var groupToReplace = { '.size-button': /pti-view-[^\s]+/, '.split-button': /pti-split-[^\s]+/ }
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
            _.isFunction(me.options.headerClick) && me.options.headerClick($selected)
        }
        var moveScrollBar = function(before, after) {
            var beforeScrollTop = before.scrollTop / (before.scrollHeight - before.height)
            var afterScrollTop = (after.scrollHeight - after.height) * beforeScrollTop
            me.jContent.slimscroll({scrollTo:  afterScrollTop + 'px' })
        }


        var createPlaylistCloseTimeout
        var createPlaylistDialog = function() {
            $addPlaylist.addClass('temp-display-none-important')
            $yes.removeClass('temp-display-none-important')
            $no.removeClass('temp-display-none-important')
            $input.removeClass('temp-display-none-important')
            $input.focus()
        }
        var closeCreatePlaylistDialog = function() {
            clearTimeout(createPlaylistCloseTimeout)
            $addPlaylist.removeClass('temp-display-none-important')
            $yes.addClass('temp-display-none-important')
            $no.addClass('temp-display-none-important')
            $input.addClass('temp-display-none-important')
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
            var id = "lPlaylist" + GUID()
            var selected = me.getIdsSelected(), playlist = selected.length ? selected : me.getIds()
            var thumbnail = SiteHandlerManager.prototype.getThumbnail( playlist.length ? playlist[0] : "" )
            $.jStorage.set(id, { id: id, name: name, thumbnail: thumbnail, data: me.arrayToString(playlist) })
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
        var $addPlaylist = $('<div class="pti-header-button temp-playlist-header-margin-left">+</div>').appendTo($header).click(createPlaylistDialog)
        var $yes = $('<div class="pti-header-button temp-create-playlist-yes temp-playlist-header-margin-left temp-display-none-important">&#x2713;</div>').appendTo($header).click(createPlaylistHandler)
        var $no = $('<div class="pti-header-button temp-create-playlist-no temp-display-none-important">&#x2573;</div>').appendTo($header).click(closeCreatePlaylistDialog)
        var $input = $('<input type="text" class="temp-create-playlist-name temp-display-none-important" placeholder="Playlist name to create"/>').appendTo($header).keypress(inputHandler)
        $header.find("[class*=set-view-" + me.options.elementSize + "]").addClass('selected')
//        me.jContent.addClass('pti-view-' + me.options.elementSize)
        $header.find("[class*=set-split-" + me.options.elementSplit + "]").addClass('selected')
//        me.jContent.addClass('pti-split-' + me.options.elementSplit)

        return $header
    }

    Playlist.prototype.drawPtiElement = SiteHandlerManager.prototype.drawPtiElement

    Playlist.prototype.recalculateJContentBuildStorageObject = function() {
        var superObject = this.parent.recalculateJContentBuildStorageObject.call(this)
        var storageObject = $.jStorage.get(this.options.id)
        var recalculatedObject = _.extend(storageObject, superObject)
        return recalculatedObject
    }

    return Playlist
})