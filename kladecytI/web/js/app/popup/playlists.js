define(["app/chrome/extension", "app/common/hash-qr", "playlist"], function(extension, redrawHashAndQRCode) {
    chrome.storage.local.get(['playlistHeaderOptions'], function (options) {
        options = extension.prepareOptions(options, { size: 'list', split: 'one'})
        window.playlist = new Playlist("#ulSecond", {
                id: chrome.extension.getBackgroundPage().windowId,
                redraw: true,
                listenKeyChangeCallback: _.wrap(redrawHashAndQRCode, function() {
                    if ($("#tabs").tabs("option", "active") == 2) {
                        $('#buildHashInput').val('http://playtheinternet.appspot.com/play.html' + playlist.buildHash())
                    }
                }),
                dontPlay: true,
                elementSize: options.size,
                elementSplit: options.split,
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
                    dontPlay: true,
                    elementSize: options.size,
                    elementSplit: options.split,
                    headerClick: extension.headerClick.bind({textAreaParseHeaderOptions: {}}),
                    execute: [
                        Playlist.prototype.addAction
                    ]
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