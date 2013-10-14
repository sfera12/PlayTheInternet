define(["playlist", "player-widget", "app/common/hash-qr"], function (a, PlayerWidget, redrawHashAndQRCode) {
    window.windowId = GUID()
    window.playlist = new Playlist("#ulSecond",
        {
            id:chrome.extension.getBackgroundPage().windowId,
            redraw:true,
            listenKeyChangeCallback:redrawHashAndQRCode,
            dontPlay:true
        });

    var backgroundWindow = chrome.extension.getBackgroundPage()
    require(['player-widget'], function (PlayerWidget) {
        window.playerWidget = new PlayerWidget('#playerWidgetContainer')
        playerWidget.data.listenObject = backgroundWindow.pti
    })

    $(document).ready(function () {
        require(["app/common/tabs"], function() {
            $("#tabs").tabs("option", "active", 4);
        })
        require(["app/popup/parse-content"])
        //hack to make scrollbar disappear
        $('html, body').css('height', '600px')
    })

    var popupPlayerMain = _.once(function () {
        window.addEventListener("unload", function (event) {
            backgroundWindow.playlist.playerType(true)
            backgroundWindow.pti.blockPlayback(false)
            var selectedVideoFeed = playlist.getSelectedVideoFeed();
            var currentPtiState = pti.get(['currentTime', 'playerState'])
            var selectedVideoPlayerState = {start:currentPtiState[0], state:currentPtiState[1]};
            backgroundWindow.playlist.playerType(true)
            backgroundWindow.playlist.playVideo({videoFeed:selectedVideoFeed}, selectedVideoPlayerState)
        }, true);
        window.playerReady = function() {
            window.backgroundWindow = chrome.extension.getBackgroundPage()
            backgroundWindow.playlist.playerType(false)
            backgroundWindow.pti.blockPlayback(true)
            var backgroundSelectedVideoFeed = backgroundWindow.playlist.getSelectedVideoFeed();
            var backgroundCurrentPtiState = backgroundWindow.pti.get(['currentTime', 'playerState'])
            var backgroundSelectedVideoPlayerState = {start:backgroundCurrentPtiState[0], state:backgroundCurrentPtiState[1]};
            //            var backgroundPlayerState = backgroundWindow.siteHandlerManager.getPlayerState();
            playlist.playerType(true)
            playlist.playVideo({videoFeed:backgroundSelectedVideoFeed}, backgroundSelectedVideoPlayerState)
            playerWidget.data.listenObject = pti
        }
        require(["iframe-observer"], function(observer) {
            observer.ready(function() {
                window.pti = observer.pti
                window.playerReady()
            })
        })
    })
    $('#tabs a[href="#player"]').click(function () {
        popupPlayerMain();
    })
})