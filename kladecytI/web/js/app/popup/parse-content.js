window.parsedPlaylist = new Playlist('#parsedPlaylist');

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
        if (request.greeting == "hello")
            sendResponse({farewell:"goodbye"});
        if (request.operation == "parsedPlaylist") {
            parsedPlaylist.playlistEmpty();
            parsedPlaylist.addSongsToPlaylist(parsedPlaylist.parseSongIds(request.data))
        } else if(request.operation == "parsePlayTheInternetParseFunctionMissing") {
            $('#parsedDiv').html(PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing(request))
        }
    }
);
chrome.tabs.executeScript(null, {file:"/js/app/popup/parsePage.js"});