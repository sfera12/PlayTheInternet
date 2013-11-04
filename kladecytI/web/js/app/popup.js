define(["playlist", "player-widget", "app/common/hash-qr"], function (a, PlayerWidget, redrawHashAndQRCode) {
    var headerClick = function (ui) {
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
    var prepareOptions = function(options, defaults) {
        var values = _.values(options)[0]
        values = values ? values : {}
		defaults = defaults ? defaults : { size: undefined, split: undefined }
        options = _.defaults(values, defaults)
        return options
    }

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

    chrome.storage.local.get(['parseHeaderOptions'], function (options) {
        options = prepareOptions(options, { size: 'list', split: 'one'})
        window.parsedPlaylist = new Playlist('#parsedPlaylist', {
                elementSize: options.size,
                elementSplit: options.split,
                headerClick: headerClick.bind({parseHeaderOptions: {}})
            }
        );
        require(["app/popup/parse-content"])
    })

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
            playlist.playVideo({index: backgroundSelectedVideoIndex}, backgroundSelectedVideoPlayerState)
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