(function () {
    if (chrome.extension) {
        console.log('loading extension js')
        var body = $('body');
        body.width(800);
        body.height(600);
        console.log('set body')
//        $($('#tabs>ul>li[aria-controls="player"]')).css('display', 'none')
        var parsedDivStyle = $($('#tabs>ul>li[aria-controls="parsedDiv"]')).css('display', 'list-item');

        window.parsedPlaylist = new Playlist('#parsedPlaylist');

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
                if (request.greeting == "hello")
                    sendResponse({farewell:"goodbye"});
                console.log(request)
                if(request.operation == "parsedPlaylist") {
                    parsedPlaylist.jPlaylist.empty();
                    parsedPlaylist.addSongsToPlaylist(parsedPlaylist.parseSongIds(request.data))
                    $("#tabs").tabs("option", "active", 4);
                }
                if(request.operation == "playVideoFeed") {
                    playlist.jPlaylist.empty();
                    playlist.addSongsToPlaylist(playlist.parseSongIds(request.playlist.join(',')));
                    var playVideoDiv = playlist.jPlaylist.find('#' + request.data.type + '\\=' + request.data.id);
                    console.log(playVideoDiv);
                    playlist.playVideoDiv(playVideoDiv);
                }
            }
        );

        chrome.tabs.executeScript(null, {file: "parsePage.js"});
    }

})();
