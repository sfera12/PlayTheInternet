define(["player-widget"], function (PlayerWidget) {
    require(["app/common/tooltips"])

    require(["app/popup/playlists"])
    require(["app/common/playlists"])

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

    require(["app/common/how"])
})