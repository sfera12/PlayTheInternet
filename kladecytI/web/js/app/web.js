require(["jquery", "underscore"], function () {
    var onceLoaded = _.once(function () {
        var currVideo = playlist.getSelectedVideoDiv()
        currVideo = currVideo ? currVideo : playlist.lookupNextSong()
        playlist.playVideo({videoDiv:currVideo})
    })

    window.playFirstLoaded = _.after(3, function () {
        console.log('playFirstLoaded')
        onceLoaded()
    })
})
define(["playlist", "app/web/pti-web", "youtube-api", "soundcloud", "vimeo", "player-widget", "parse", "app/web/calendar", "app/web/tabsDrool", "app/common/hash-qr"], function (a, pti, c, d, e, f, g, h, i, redrawHashAndQRCode) {
    window.pti = pti
    $(document).ready(function () {
        var playerWidget
        require(['player-widget'], function (PlayerWidget) {
            playerWidget = new PlayerWidget('#playerWidgetContainer')
            playerWidget.data.listenObject = pti
        })

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
        var playlist = window.playlist
        playlist.addSongsToPlaylist(playlist.parseSongIds(window.location.hash), true)

        $.jStorage.subscribe('queryWindowIds', function (message) {
//        console.log(message)
            $.jStorage.publish('windowIds', windowId)
        })
        window.ulFirst = new Playlist('#ulFirst', {dontPlay:true})
        $('#tAreaParseButton').click(function () {
            var tAreaText = $('#tArea').val()
            playlist.addSongsToPlaylist(playlist.parseSongIds(playTheInternetParse(tAreaText)), true)
        })
        $('#buildHash').click(function () {
            $('#buildHashInput').val(window.location.origin + '/display-grid.html' + playlist.buildHash())
        })
        $('#renameWindow').click(function () {
            var renameWindowInputVal = $('#renameWindowInput').val();
            if (renameWindowInputVal.length > 0) {
                document.title = document.title.replace(windowId, renameWindowInputVal)
                windowId = renameWindowInputVal
            }
        })

        if (window.location.hash.length == 0) {
            $("#tabs").tabs("option", "active", 1);
        }
    })
})