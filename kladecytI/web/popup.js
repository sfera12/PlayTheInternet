(function () {
    if (chrome.extension) {
        if (chrome.extension.getBackgroundPage() != window) {
            var body = $('body');
            body.width(800);
            body.height(600);
//        $($('#tabs>ul>li[aria-controls="player"]')).css('display', 'none')
            var parsedDivStyle = $($('#tabs>ul>li[aria-controls="parsedDiv"]')).css('display', 'list-item');

            window.parsedPlaylist = new Playlist('#parsedPlaylist');
            $(window).ready(function() {
                window.playlist.setId(chrome.extension.getBackgroundPage().windowId)
                $.jStorage.publish('backgroundPage', {operation: 'getCurrentVideoFeed'})
            })


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
            chrome.tabs.executeScript(null, {file:"parsePage.js"});
            addEventListener("unload", function (event) {
                $.jStorage.publish('backgroundPage', {operation:'playCurrentVideoFeed', data:$(playlist.jPlaylist.find('.selected')).data('videoFeed')})
            }, true);

            $.jStorage.subscribe('popupPage', function(channel, payload) {
//                console.log(payload)
                if (payload.operation == "backgroundPagePlaylist") {
                    playlist.jPlaylist.empty();
                    playlist.addSongsToPlaylist(playlist.parseSongIds(payload.playlist.join(',')));
                    var playVideoDiv = playlist.jPlaylist.find('#' + Playlist.prototype.escapeUrl(payload.data.type, payload.data.id));
                    playlist.playVideoDiv(playVideoDiv);
                } else if(payload.operation == 'currentVideoFeed') {
                    if (payload.data) {
                    var playVideoDiv = playlist.jPlaylist.find('#' + Playlist.prototype.escapeUrl(payload.data.type, payload.data.id));
                    playlist.selectVideo(playVideoDiv);
                    } else {
                        throw "currentVideoFeed operation in popupPage is called with empty or null data"
                    }
                }
            })
        }

        if (chrome.extension.getBackgroundPage() == window) {
            $.jStorage.subscribe('backgroundPage', function(channel, payload) {
//                console.log(payload)
                if (payload.operation == "playCurrentVideoFeed") {
//                    playlist.jPlaylist.empty();
//                    playlist.addSongsToPlaylist(playlist.parseSongIds(payload.playlist.join(',')));
                    var playVideoDiv = playlist.jPlaylist.find('#' + Playlist.prototype.escapeUrl(payload.data.type, payload.data.id));
                    playlist.playVideoDiv(playVideoDiv);
                } else if (payload.operation == "getPlaylist") {
                    $.jStorage.publish('popupPage', {operation:'backgroundPagePlaylist', data:$(playlist.jPlaylist.find('.selected')).data('videoFeed'), playlist:playlist.sortableArray})
                    youtube.stopVideo()
                } else if (payload.operation == "getCurrentVideoFeed") {
                    $.jStorage.publish('popupPage', {operation:'currentVideoFeed', data:$(playlist.jPlaylist.find('.selected')).data('videoFeed')})
                    youtube.stopVideo()
                }


            })
        }
    }

})();
