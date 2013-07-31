(function () {
    if (chrome.extension) {
        console.log('loading extension js')
        var body = $('body');
        body.width(800);
        body.height(600);
        console.log('set body')

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
                if (request.greeting == "hello")
                    sendResponse({farewell:"goodbye"});
                console.log(request)
                if(request.operation == "playVideoFeed") {
                    playlist.jPlaylist.empty();
                    playlist.addSongsToPlaylist(playlist.parseSongIds(request.playlist.join(',')));
                    var playVideoDiv = playlist.jPlaylist.find('#' + request.data.type + '\\=' + request.data.id);
                    console.log(playVideoDiv);
                    playlist.playVideoDiv(playVideoDiv);
                }
            }
        );
    }

})();
