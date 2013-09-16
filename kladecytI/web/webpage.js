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
        var playerWidget = new PlayerWidget('#playerWidgetContainer')
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


        var tabsPlayerContainer = $('#tabs .tabs-player-container')
        $('#tabs').tabs({
            activate:function (event, ui) {
                var newTab = $(ui.newTab);
                if(newTab.text() == "Options") {
                    buildQR()
                }
//        console.log(newTab.text())
//            if(newTab.text() == "Calendar") {
//                propagateCalendar()
//            }
                if (newTab.text() == "Player") {
                    tabsPlayerContainer.removeClass('leftFull')
                    tabsPlayerContainer.addClass('tabs-player-container')
                } else {
                    tabsPlayerContainer.addClass('leftFull')
                    tabsPlayerContainer.removeClass('tabs-player-container')
                }
                newTab.addClass('active')
                $(ui.oldTab).removeClass('active')
            }
        })
        if (window.location.hash.length == 0) {
            $("#tabs").tabs("option", "active", 1);
        }
    })
}

function buildQR() {
    $.ajax({
        url:'https://www.googleapis.com/urlshortener/v1/url',
        type: 'post',
        contentType: 'application/json',
        data:'{"longUrl":"' + window.location.href.substr(0,2039) + '"}',
        success: function() { console.log(arguments); $('#qrcode').empty(); $('#qrcode').qrcode(arguments[0].id)},
        error: function() {console.log('buildqr error');console.log(arguments)}
    })
}

function redrawHashAndQRCode(playlist) {
    window.location.hash = playlist.jPlaylist.sortable('toArray')
    if($("#tabs").tabs("option", "active") == 2) {
        buildQR()
    }
}