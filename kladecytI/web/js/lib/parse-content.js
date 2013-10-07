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
        }
    }
);
chrome.tabs.executeScript(null, {file:"/js/lib/parsePage.js"});