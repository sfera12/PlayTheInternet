define(["app/chrome/extension", "app/common/hash-qr", "pti-playlist"], function(extension, redrawHashAndQRCode, Playlist) {
    chrome.storage.local.get(['playlistHeaderOptions'], function (options) {
        options = extension.prepareOptions(options, { size: 'list', split: 'one'})
        var selected = $.jStorage.get("selected_backgroundPageId"), index = selected && selected.index >= 0 && selected.index
        window.playlist = new Playlist("#ulSecond", {
                id: chrome.extension.getBackgroundPage().windowId,
                scrollTo: index,
                recalculateJContentImmediateCallback: redrawHashAndQRCode,
                elementSize: options.size,
                elementSplit: options.split,
                connectWith: "connected-playlist",
                headerClick: extension.headerClick.bind({playlistHeaderOptions: {}}),
                execute: [
                    Playlist.prototype.playAction
                ]
            }
        );
    })

    chrome.storage.local.get(['textAreaParseHeaderOptions'], function(options) {
        options = extension.prepareOptions(options, { size: 'list', split: 'one'})
        var createPlaylist = _.once(function() {
            window.textAreaParsePlaylist = new Playlist("#textAreaParsePlaylist", {
                    playerType: false,
                    elementSize: options.size,
                    elementSplit: options.split,
                    connectWith: "connected-playlist",
                    headerClick: extension.headerClick.bind({textAreaParseHeaderOptions: {}}),
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