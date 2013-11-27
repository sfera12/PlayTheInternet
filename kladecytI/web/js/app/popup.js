define(["playlist", "player-widget", "app/common/hash-qr"], function (a, PlayerWidget, redrawHashAndQRCode) {
    window.headerClick = function (ui) {
        var options = _.values(this)[0]
        ui.parent().find('.selected').each(function (index, item) {
            var classes = $(item).attr('class').split(' ')
            var size = classes[0].replace(/set-\w+-/, '')
            if (classes[2].match(/size/)) {
                options.size = size
            } else if (classes[2].match(/split/)) {
                options.split = size
            }
        })
        chrome.storage.local.set(this)
    }
    window.prepareOptions = function(options, defaults) {
        var values = _.values(options)[0]
        values = values ? values : {}
		defaults = defaults ? defaults : { size: undefined, split: undefined }
        options = _.defaults(values, defaults)
        return options
    }

    window.tooltipClick = function() {
        var property = new Object();
        property[this.id] = this.checked
        tooltipCallbacks[this.id](this.checked)
        chrome.storage.local.set(property)
    }

    window.tooltipsInit = function() {
        var tooltips = ['playTooltipCheckbox', 'playlistTooltipCheckbox']
        for(var i = 0; i < tooltips.length; i++) {
            tooltipInit(tooltips[i])
        }
    }
    window.tooltipCallbacks = {
        'playTooltipCheckbox': function(toggle) {
            $('#playerWidgetContainer').find('.play>div').toggleClass('temp-tooltip-active', toggle)
        },
        'playlistTooltipCheckbox': function(toggle) {
            $('#ulSecond').toggleClass('temp-playlist-drop-here', toggle)
        }
    }
    window.tooltipInit = function(tooltip) {
        var $tooltip = $('#' + tooltip).click(tooltipClick);
        chrome.storage.local.get(tooltip, function(options) {
            var preparedOptions = _.keys(options).length ? options : undefined
            if(!_.isUndefined(preparedOptions)) {
                var toggle = _.values(preparedOptions)[0];
                $tooltip.attr('checked', toggle)
                tooltipCallbacks[tooltip](toggle)
            } else {
                $tooltip.attr('checked', true)
            }
        })
    }
    tooltipsInit()

    window.windowId = GUID()
    chrome.storage.local.get(['playlistHeaderOptions'], function (options) {
        options = prepareOptions(options, { size: 'list', split: 'one'})
        window.playlist = new Playlist("#ulSecond", {
                id: chrome.extension.getBackgroundPage().windowId,
                redraw: true,
                listenKeyChangeCallback: _.wrap(redrawHashAndQRCode, function() {
                    if ($("#tabs").tabs("option", "active") == 2) {
                        $('#buildHashInput').val('http://playtheinternet.appspot.com/play.html' + playlist.buildHash())
                    }
                }),
                dontPlay: true,
                elementSize: options.size,
                elementSplit: options.split,
                headerClick: headerClick.bind({playlistHeaderOptions: {}})
            }
        );
    })

    chrome.storage.local.get(['textAreaParseHeaderOptions'], function(options) {
        options = prepareOptions(options, { size: 'list', split: 'one'})
        var createPlaylist = _.once(function() {
            window.textAreaParsePlaylist = new Playlist("#textAreaParsePlaylist", {
                    dontPlay: true,
                    elementSize: options.size,
                    elementSplit: options.split,
                    headerClick: headerClick.bind({textAreaParseHeaderOptions: {}})
                }
            );
        })
        $('#tAreaParseButton').click(function () {
            var tAreaText = $('#tArea').val()
            createPlaylist()
            textAreaParsePlaylist.playlistEmpty();
            require(['cparse'], function() {
                textAreaParsePlaylist.addSongsToPlaylist(textAreaParsePlaylist.parseSongIds(playTheInternetParse(tAreaText)), true)
            })
        })
    })

    var backgroundWindow = chrome.extension.getBackgroundPage()
    require(['player-widget'], function (PlayerWidget) {
        window.playerWidget = new PlayerWidget('#playerWidgetContainer', true)
        playerWidget.data.listenObject = backgroundWindow.pti
    })
    require(["app/common/tabs"], function () {
        $("#tabs").tabs("option", "active", 3);
    })

    require(["app/popup/parse-content"])

    $(document).ready(function () {
        //hack to make scrollbar disappear
        $('html, body').css('height', '600px')
    })

    var popupPlayerMain = _.once(function () {
        window.addEventListener("unload", function (event) {
            backgroundWindow.playlist.playerType(true)
            backgroundWindow.pti.blockPlayback(false)
            var selectedVideoIndex = playlist.getSelectedVideoIndex();
            var currentPtiState = pti.get(['currentTime', 'playerState', 'soundIndex'])
            var selectedVideoPlayerState = {start: currentPtiState[0], state: currentPtiState[1], index: currentPtiState[2]};
            backgroundWindow.playlist.playerType(true)
            backgroundWindow.playlist.playVideo({index: selectedVideoIndex}, selectedVideoPlayerState)
        }, true);
        window.playerReady = function () {
            window.backgroundWindow = chrome.extension.getBackgroundPage()
            backgroundWindow.playlist.playerType(false)
            backgroundWindow.pti.blockPlayback(true)
            var backgroundSelectedVideoIndex = backgroundWindow.playlist.getSelectedVideoIndex();
            var backgroundCurrentPtiState = backgroundWindow.pti.get(['currentTime', 'playerState', 'soundIndex'])
            var backgroundSelectedVideoPlayerState = {start: backgroundCurrentPtiState[0], state: backgroundCurrentPtiState[1], index: backgroundCurrentPtiState[2]};
            //            var backgroundPlayerState = backgroundWindow.siteHandlerManager.getPlayerState();
            playlist.playerType(true)
            if(backgroundSelectedVideoIndex >= 0) {
                playlist.playVideo({index: backgroundSelectedVideoIndex}, backgroundSelectedVideoPlayerState)
            } else {
                playlist.playVideo({videoDiv: playlist.lookupNextSong()})
            }
            playerWidget.data.listenObject = pti
        }
        require(["iframe-observer"], function (observer) {
            window.observer = observer
            window.pti = observer.pti
            window.playerReady()
        })
    })
    $('#tabs a[href="#player"]').click(function () {
        popupPlayerMain();
    })
})