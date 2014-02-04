define(["app/common/hash-qr", "pti-playlist"], function (redrawHashAndQRCode, Playlist) {
    var selected = $.jStorage.get("selected_backgroundPageId"), index = selected && selected.index >= 0 && selected.index
    window.playlist = new Playlist("#ulSecond", {
            id: chrome.extension.getBackgroundPage().windowId,
            scrollTo: index,
            recalculateJContentImmediateCallback: redrawHashAndQRCode,
            connectWith: "connected-playlist",
            headerConfigKey: "lConfigPlaylistHeader",
            execute: [
                Playlist.prototype.playAction
            ]
        }
    );

    var createPlaylist = _.once(function () {
        window.textParsePlaylist = new Playlist("#textAreaParsePlaylist", {
            playerType: false,
            connectWith: "connected-playlist",
            headerConfigKey: "lConfigTextAreaParsePlaylistHeader",
                    execute: [
                        Playlist.prototype.addAction,
                        function() {
                            this.tabsGetPlaylist = tabs.second.getPlaylist
                        }
                    ]
        })
    })
    $('#tAreaParseButton').click(function () {
        var tAreaText = $('#tArea').val()
        createPlaylist()
        textParsePlaylist.emptyContent();
        require(['cparse'], function () {
                textParsePlaylist.addElementsToList(_.stringToArray(playTheInternetParse(tAreaText)), true)
        })
    })
})