(function () {
    if (chrome.extension) {
        if (chrome.extension.getBackgroundPage() != window) {
            console.log('loading extension js')
            var body = $('body');
            body.width(800);
            body.height(600);
            console.log('set body')
//        $($('#tabs>ul>li[aria-controls="player"]')).css('display', 'none')
            var parsedDivStyle = $($('#tabs>ul>li[aria-controls="parsedDiv"]')).css('display', 'list-item');

            window.parsedPlaylist = new Playlist('#parsedPlaylist');
            $(window).ready(function() {
                window.playlist.setId(chrome.extension.getBackgroundPage().windowId)
                $.jStorage.publish('backgroundPage', {operation: 'getCurrentVideoFeed'})
            })


            chrome.runtime.onMessage.addListener(
                function (request, sender, sendResponse) {
                    console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
                    if (request.greeting == "hello")
                        sendResponse({farewell:"goodbye"});
                    console.log(request)
                    if (request.operation == "parsedPlaylist") {
                        parsedPlaylist.jPlaylist.empty();
                        parsedPlaylist.addSongsToPlaylist(parsedPlaylist.parseSongIds(request.data))
                        $("#tabs").tabs("option", "active", 4);
                    }
                    if (request.operation == "playVideoDiv") {
                        var playVideoDiv = playlist.jPlaylist.find('#' + request.data.type + '\\=' + request.data.id);
                        console.log(playVideoDiv);
                        playlist.playVideoDiv(playVideoDiv);
                    }
                }
            );
            chrome.tabs.executeScript(null, {file:"parsePage.js"});
            addEventListener("unload", function (event) {
//                background.console.log(event.type);
//                background.console.log($(playlist.jPlaylist.find('.selected')).data('videoFeed'));
//                $.jStorage.set('playPlaylist', new Date().getTime());
                $.jStorage.publish('backgroundPage', {operation:'playCurrentVideoFeed', data:$(playlist.jPlaylist.find('.selected')).data('videoFeed')})
//                chrome.runtime.sendMessage({greeting:"hello"})
//                chrome.runtime.sendMessage({operation:'playPlaylist', data:$(playlist.jPlaylist.find('.selected')).data('videoFeed'), playlist:playlist.sortableArray}, function (response) {
//                    console.log(response)
//                })
            }, true);

            $.jStorage.subscribe('popupPage', function(channel, payload) {
                console.log(payload)
                if (payload.operation == "backgroundPagePlaylist") {
                    playlist.jPlaylist.empty();
                    playlist.addSongsToPlaylist(playlist.parseSongIds(payload.playlist.join(',')));
                    var playVideoDiv = playlist.jPlaylist.find('#' + payload.data.type + '\\=' + payload.data.id);
                    console.log(playVideoDiv);
                    playlist.playVideoDiv(playVideoDiv);
                } else if(payload.operation == 'currentVideoFeed') {
                    var playVideoDiv = playlist.jPlaylist.find('#' + payload.data.type + '\\=' + payload.data.id);
                    console.log(playVideoDiv);
                    playlist.playVideoDiv(playVideoDiv);
                }
            })
        }

        if (chrome.extension.getBackgroundPage() == window) {
            $.jStorage.subscribe('backgroundPage', function(channel, payload) {
                console.log(payload)
                if (payload.operation == "playCurrentVideoFeed") {
                    console.log(payload);
//                    playlist.jPlaylist.empty();
//                    playlist.addSongsToPlaylist(playlist.parseSongIds(payload.playlist.join(',')));
                    var playVideoDiv = playlist.jPlaylist.find('#' + payload.data.type + '\\=' + payload.data.id);
                    console.log(playVideoDiv);
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
