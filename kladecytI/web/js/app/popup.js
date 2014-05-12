define(["player/player-widget"], function (PlayerWidget) {
    require(["app/common/tooltips"])

    require(["app/popup/playlists"])

    var backgroundWindow = chrome.extension.getBackgroundPage()
    window.playerWidget = new PlayerWidget('#playerWidgetContainer', true)
    playerWidget.data.listenObject = backgroundWindow.pti

    require(["app/common/tabs"])
    require(["app/popup/parse-content"], function() {
        window.tabs.first.playlist = parsedPlaylist //TODO move it to tabs
    })

    $(document).ready(function () {
        //hack to make scrollbar disappear
        $('html, body').css('height', '600px')
    })

    var popupPlayerMain = _.once(function () {
        window.addEventListener("unload", function (event) {
            var selectedVideoIndex = playlist.getSelectedVideoIndex();
            var currentPtiState = pti.get(['currentTime', 'soundIndex'])
            var selectedVideoPlayerState = {start: currentPtiState[0], index: currentPtiState[1]};
            backgroundWindow.playlist.playerType(true)
            backgroundWindow.playlist.playVideo({index: selectedVideoIndex}, selectedVideoPlayerState)
			backgroundWindow.pti.playing(pti.playing())
            backgroundWindow.pti.volume(pti.volume())
        }, true);
        window.playerReady = function () {
            window.backgroundWindow = chrome.extension.getBackgroundPage()
            var backgroundSelectedVideoIndex = backgroundWindow.playlist.getSelectedVideoIndex();
            var backgroundCurrentPtiState = backgroundWindow.pti.get(['currentTime', 'soundIndex'])
            var backgroundSelectedVideoPlayerState = {start: backgroundCurrentPtiState[0], index: backgroundCurrentPtiState[1]};
            playlist.playerType(true)
            if(backgroundSelectedVideoIndex >= 0) {
                playlist.playVideo({index: backgroundSelectedVideoIndex}, backgroundSelectedVideoPlayerState)
            } else {
                playlist.playVideo({videoDiv: playlist.lookupNextSong()})
            }
			pti.playing(backgroundWindow.pti.playing())
			pti.volume(backgroundWindow.pti.volume())
            playerWidget.data.listenObject = pti
            backgroundWindow.playlist.playerType(false)
            backgroundWindow.pti.pauseVideo()
        }
        require(["player/iframe-observer"], function (observer) {
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