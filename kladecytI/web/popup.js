(function () {
    if (chrome.extension) {
        chrome.webRequest.onBeforeSendHeaders.addListener(
            function(details) {
                details.requestHeaders.push({name: "Referer", value: "chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii/"})
                return {requestHeaders: details.requestHeaders};
            },
            {urls: ["<all_urls>"]},
            ["blocking", "requestHeaders"]);
        if (chrome.extension.getBackgroundPage() != window) {
//        $($('#tabs>ul>li[aria-controls="player"]')).css('display', 'none')
            var parsedDivStyle = $($('#tabs>ul>li[aria-controls="parsedDiv"]')).css('display', 'list-item');

            window.parsedPlaylist = new Playlist('#parsedPlaylist');

            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
                    if (request.greeting == "hello")
                        sendResponse({farewell:"goodbye"});
                    if (request.operation == "parsedPlaylist") {
                        parsedPlaylist.jPlaylist.empty();
                        parsedPlaylist.addSongsToPlaylist(parsedPlaylist.parseSongIds(request.data))
                        $("#tabs").tabs("option", "active", 4);
                    }
                }
            );


            $.jStorage.subscribe('popupPage', function(channel, payload) {
//                console.log(payload)
                if (payload.operation == "backgroundPagePlaylist") {
                    playlist.jPlaylist.empty();
                    playlist.addSongsToPlaylist(playlist.parseSongIds(payload.playlist.join(',')));
                    var playVideoDiv = playlist.jPlaylist.find('#' + Playlist.prototype.escapeUrl(payload.data.type, payload.data.id));
                    playlist.playVideoDiv(playVideoDiv);
                } else if(payload.operation == 'selectVideoFeed') {
                    if (payload.data) {
                    var playVideoDiv = playlist.jPlaylist.find('#' + Playlist.prototype.escapeUrl(payload.data.type, payload.data.id));
                    playlist.selectVideo(playVideoDiv);
                    } else {
                        throw "currentVideoFeed operation in popupPage is called with empty or null data"
                    }
                } else if (payload.operation == 'playVideoFeed') {
                    var playVideoDiv = playlist.jPlaylist.find('#' + Playlist.prototype.escapeUrl(payload.data.type, payload.data.id));
                    console.log(payload.playerState)
                    playlist.playVideoDiv(playVideoDiv, payload.playerState);
                }
            })
        }

        if (chrome.extension.getBackgroundPage() == window) {
            $.jStorage.subscribe('backgroundPage', function(channel, payload) {
                console.log(payload)
                if (payload.operation == "playVideoFeed") {
//                    playlist.jPlaylist.empty();
//                    playlist.addSongsToPlaylist(playlist.parseSongIds(payload.playlist.join(',')));
                    var playVideoDiv = playlist.jPlaylist.find('#' + Playlist.prototype.escapeUrl(payload.data.type, payload.data.id));
                    console.log(payload.playerState)
                    playlist.playVideoDiv(playVideoDiv, payload.playerState);
                } else if (payload.operation == "getSelectedVideoFeed") {
                    var playerState = SiteHandlerManager.prototype.getPlayerState();
                    $.jStorage.publish('popupPage', {operation: payload.callback, data:$(playlist.getSelectedVideo()).data('videoFeed'), playerState: playerState})
                } else if (payload.operation == "stopVideo") {
                    console.log('stopVideo')
                    youtube.stopVideo()
                }


            })
        }
    }

})();
