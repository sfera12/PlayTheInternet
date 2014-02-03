define(["app/common/hash-qr", "pti-playlist"], function(redrawHashAndQRCode, Playlist) {
    chrome.storage.local.get(['playlistHeaderOptions'], function (options) {
        var selected = $.jStorage.get("selected_backgroundPageId"), index = selected && selected.index >= 0 && selected.index
        window.playlist = new Playlist("#ulSecond", {
                id: chrome.extension.getBackgroundPage().windowId,
                scrollTo: index,
                recalculateJContentImmediateCallback: redrawHashAndQRCode,
                elementSize: options.size,
                elementSplit: options.split,
                connectWith: "connected-playlist",
                headerConfigKey: "lConfigPlaylistHeader",
                execute: [
                    Playlist.prototype.playAction
                ]
            }
        );
    })

    chrome.storage.local.get(['textAreaParseHeaderOptions'], function(options) {
        var createPlaylist = _.once(function() {
            window.textAreaParsePlaylist = new Playlist("#textAreaParsePlaylist", {
                    playerType: false,
                    elementSize: options.size,
                    elementSplit: options.split,
                    connectWith: "connected-playlist",
                    headerConfigKey: "lConfigTextAreaParsePlaylistHeader",
//                    execute: [
//                        Playlist.prototype.addAction
//                    ]
                }
            );
        })
        $('#tAreaParseButton').click(function () {
            var tAreaText = $('#tArea').val()
            createPlaylist()
            textAreaParsePlaylist.playlistEmpty();
            require(['cparse'], function() {
                textAreaParsePlaylist.addSongsToPlaylist(textAreaParsePlaylist.parseSongIds(playTheInternetParse(tAreaText)), true)
            })
        })
    })
})