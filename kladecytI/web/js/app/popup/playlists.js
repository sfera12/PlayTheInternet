define(["app/chrome/extension", "app/common/hash-qr", "pti-playlist"], function(extension, redrawHashAndQRCode, Playlist) {
    chrome.storage.local.get(['playlistHeaderOptions'], function (options) {
        options = extension.prepareOptions(options, { size: 'list', split: 'one'})
        window.playlist = new Playlist("#ulSecond", {
                id: chrome.extension.getBackgroundPage().windowId,
                redraw: true,
//                listenKeyChangeCallback: redrawHashAndQRCode,
//                dontPlay: true,
                elementSize: options.size,
                elementSplit: options.split,
                connectWith: "connected-playlist"
//                headerClick: extension.headerClick.bind({playlistHeaderOptions: {}}),
//                execute: [
//                    Playlist.prototype.playAction
//                ]
            }
        );
        var selected = playlist.jContent.find('.selected');
        var index = selected.index()
        var songsCount = playlist.jContent.find('.pti-element').length
        var scrollHeight = playlist.jContent.prop('scrollHeight')
        var scrollTo = scrollHeight / songsCount * index - playlist.jContent.height() / 2 - selected.height() / 2
        playlist.jContent.slimscroll({scrollTo: scrollTo + 'px'})
    })

    chrome.storage.local.get(['textAreaParseHeaderOptions'], function(options) {
        options = extension.prepareOptions(options, { size: 'list', split: 'one'})
        var createPlaylist = _.once(function() {
            window.textAreaParsePlaylist = new Playlist("#textAreaParsePlaylist", {
//                    dontPlay: true,
                    elementSize: options.size,
                    elementSplit: options.split,
                    connectWith: "connected-playlist"
//                    headerClick: extension.headerClick.bind({textAreaParseHeaderOptions: {}}),
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