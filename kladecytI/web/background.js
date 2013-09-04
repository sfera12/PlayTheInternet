if (chrome.extension && chrome.extension.getBackgroundPage() == window) {
    $(document).ready(function () {
        window.windowId = 'backgroundPageId'
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                listenKeyChangeCallback:redrawHashAndQRCode,
                debounceRecalculatePlaylistCallback:_.once(function () {
                    console.log('playFirstLoaded debounce')
                    playFirstLoaded()
                }),
                redraw:true
            });

//        $.jStorage.subscribe('backgroundPage', function (channel, payload) {
//            console.log(payload)
//            if(payload.operation == "popupPlayerMain") {
//                //TODO 2013-08-21 make popup player main
//                $.jStorage.set(playlist.id + '_selected', {source: playlist.uid, data: playlist.getSelectedVideoFeed(), playerState: SiteHandlerManager.prototype.getPlayerState()})
//            } else if (payload.operation == "playVideoFeed") {
////                    playlist.jPlaylist.empty();
////                    playlist.addSongsToPlaylist(playlist.parseSongIds(payload.playlist.join(',')));
//                SiteHandlerManager.prototype.blockPlayback(false)
//                var playVideoDiv = playlist.jPlaylist.find(Playlist.prototype.concatId(payload.data.type, payload.data.id));
//                console.log(payload.playerState)
//                playlist.playVideo({videoDiv:playVideoDiv}, payload.playerState);
//            } else if (payload.operation == "getSelectedVideoFeed") {
//                var playerState = SiteHandlerManager.prototype.getPlayerState();
//                $.jStorage.publish('popupPage', {operation:payload.callback, data:playlist.getSelectedVideoFeed(), playerState:playerState})
//            } else if (payload.operation == "stopVideo") {
//                console.log('stopVideo')
//                SiteHandlerManager.prototype.blockPlayback(true)
//            }
//        })
    })
}