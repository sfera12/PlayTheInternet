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
console.log('play first loaded initialized')
define(["playlist", "pti-web", "youtube-api", "soundcloud", "vimeo", "playerwidget"], function (a, b, c, d) {
    $(document).ready(function () {
        var tabsPlayerContainer = $('#tabs .tabs-player-container')
        $('#tabs').tabs({
            activate:function (event, ui) {
                var newTab = $(ui.newTab);
                if (newTab.text() == "Options") {
                    require(["qrcode"], function() {
                        buildQR()
                    })
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
        window.windowId = GUID()
        document.title = windowId

        var redrawHashAndQRCode = function (playlist) {
            window.location.hash = playlist.jPlaylist.sortable('toArray')
            if ($("#tabs").tabs("option", "active") == 2) {
                buildQR()
            }
        }
        var buildQR = function () {
            $.ajax({
                url:'https://www.googleapis.com/urlshortener/v1/url',
                type:'post',
                contentType:'application/json',
                data:'{"longUrl":"' + window.location.href.substr(0, 2039) + '"}',
                success:function () {
                    console.log(arguments);
                    $('#qrcode').empty();
                    $('#qrcode').qrcode(arguments[0].id)
                },
                error:function () {
                    console.log('buildqr error');
                    console.log(arguments)
                }
            })
        }
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

        var playerWidget = new PlayerWidget('#playerWidgetContainer')
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