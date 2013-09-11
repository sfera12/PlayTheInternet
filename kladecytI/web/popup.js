if (chrome.extension) {
    if (chrome.extension.getBackgroundPage() != window) {
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

        var parsedDivStyle = $($('#tabs>ul>li[aria-controls="parsedDiv"]')).css('display', 'list-item');

        window.parsedPlaylist = new Playlist('#parsedPlaylist');

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
                if (request.greeting == "hello")
                    sendResponse({farewell:"goodbye"});
                if (request.operation == "parsedPlaylist") {
                    parsedPlaylist.jPlaylist.empty();
                    parsedPlaylist.addSongsToPlaylist(parsedPlaylist.parseSongIds(request.data))
                }
            }
        );

        $(document).ready(function() {
            $("#tabs").tabs("option", "active", 4);
            window.playerWidget = new PlayerWidget('#playerWidgetContainer')
            var backgroundWindow = chrome.extension.getBackgroundPage()
            playerWidget.data.listenObject = backgroundWindow.pti
        })

        var popupPlayerMain = _.once(function () {
            window.addEventListener("unload", function (event) {
                backgroundWindow.playlist.playerType(true)
                backgroundWindow.pti.blockPlayback(false)
                var selectedVideoFeed = playlist.getSelectedVideoFeed();
                var currentPtiState = pti.get(['currentTime', 'playerState'])
                var selectedVideoPlayerState = {start: currentPtiState[0], state: currentPtiState[1]};
                backgroundWindow.playlist.playerType(true)
                backgroundWindow.playlist.playVideo({videoFeed:selectedVideoFeed}, selectedVideoPlayerState)
            }, true);
            var backgroundWindow = chrome.extension.getBackgroundPage()
            backgroundWindow.playlist.playerType(false)
            backgroundWindow.pti.blockPlayback(true)
            var backgroundSelectedVideoFeed = backgroundWindow.playlist.getSelectedVideoFeed();
            var backgroundCurrentPtiState = backgroundWindow.pti.get(['currentTime', 'playerState'])
            var backgroundSelectedVideoPlayerState = {start: backgroundCurrentPtiState[0], state: backgroundCurrentPtiState[1]};
//            var backgroundPlayerState = backgroundWindow.siteHandlerManager.getPlayerState();
            playlist.playerType(true)
            playlist.playVideo({videoFeed:backgroundSelectedVideoFeed}, backgroundSelectedVideoPlayerState)
            playerWidget.data.listenObject = pti
        })
        $('#tabs a[href="#player"]').click(function () {
            popupPlayerMain();
        })
    }
}
