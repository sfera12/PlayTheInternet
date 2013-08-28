if (!chrome.extension) {
    var onceLoaded = _.once(function () {
        var currVideo = playlist.getSelectedVideoDiv()
        currVideo = currVideo ? currVideo : playlist.lookupNextSong()
        playlist.playVideo({videoDiv:currVideo})
    })

    var playFirstLoaded = _.after(3, function () {
        console.log('playFirstLoaded')
        onceLoaded()
    })

    $(document).ready(function () {
        window.windowId = GUID()
        document.title = windowId
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                redraw:false,
                listenKeyChangeCallback:redrawHashAndQRCode,
                debounceRecalculatePlaylistCallback:_.once(function () {
                    console.log('playFirstLoaded debounce')
                    playFirstLoaded()
                })
            });
        playlist.addSongsToPlaylist(playlist.parseSongIds(window.location.hash), true)
    })
}