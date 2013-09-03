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
                //TODO 2013-08-27 temporary while working on PTI
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
                    $("#tabs").tabs("option", "active", 4);
                }
            }
        );

        var popupPlayerMain = _.once(function () {
            window.addEventListener("unload", function (event) {
                backgroundWindow.playlist.playerType(true)
                backgroundWindow.pti.blockPlayback(false)
                var selectedVideoFeed = playlist.getSelectedVideoFeed();
                var selectedVideoPlayerState = {start: pti[selectedVideoFeed.type].currentTime()};
                backgroundWindow.playlist.playerType(true)
                backgroundWindow.playlist.playVideo({videoFeed:selectedVideoFeed}, selectedVideoPlayerState)
            }, true);
            var backgroundWindow = chrome.extension.getBackgroundPage()
            backgroundWindow.playlist.playerType(false)
            backgroundWindow.pti.blockPlayback(true)
            var backgroundSelectedVideoFeed = backgroundWindow.playlist.getSelectedVideoFeed();
            var backgroundSelectedVideoPlayerState = {start: backgroundWindow.pti[backgroundSelectedVideoFeed.type].currentTime()};
//            var backgroundPlayerState = backgroundWindow.siteHandlerManager.getPlayerState();
            playlist.playerType(true)
            playlist.playVideo({videoFeed:backgroundSelectedVideoFeed}, backgroundSelectedVideoPlayerState)
        })
        $('#tabs a[href="#player"]').click(function () {
            popupPlayerMain();
        })
    }
}
