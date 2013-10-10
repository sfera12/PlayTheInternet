window.playFirstLoaded = function () {
}
window.redrawHashAndQRCode = function () {
}
var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "popup.css";
document.getElementsByTagName("head")[0].appendChild(link);

define(["playlist", "app/popup/iframe-popup", "player-widget", "app/common/hash-qr"], function (a, observer, PlayerWidget, redrawHashAndQRCode) {
    window.pti = observer.pti
    window.windowId = GUID()
    window.playlist = new Playlist("#ulSecond",
        {
            id:chrome.extension.getBackgroundPage().windowId,
            redraw:true,
            listenKeyChangeCallback:redrawHashAndQRCode,
            debounceRecalculatePlaylistCallback:_.once(function () {
                console.log('playFirstLoaded debounce')
                playFirstLoaded()
            }),
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
        //TODO listen to events even before iframe is created and add iframe after(make IframeWrapper AMD module)
        require(["app/popup/iframe-popup"], function () {
            window.afterPlayerReady()
        })
    })
    $('#tabs a[href="#player"]').click(function () {
        popupPlayerMain();
    })
})