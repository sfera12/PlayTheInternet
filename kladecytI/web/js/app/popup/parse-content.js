define(["playlist", "pti-playlist"], function(a, Playlist) {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
            if (request.greeting == "hello")
                sendResponse({farewell:"goodbye"});
            if (request.operation == "parsedPlaylist") {
                request.data != '' ? parsedPlaylist.addElementsToList(_.stringToArray(request.data)) : $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound(request))
            } else if(request.operation == "parsePlayTheInternetParseFunctionMissing") {
                $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing(request))
            }
        }
    );
    window.parsedPlaylist = new Playlist('#parsedPlaylist', {
            connectWith: "connected-playlist",
            headerConfigKey: "lConfigParsedPlaylistHeader",
            execute: [
                Playlist.prototype.addAction,
                function() {
                    this.tabsGetPlaylist = tabs.second.getPlaylist
                }
            ]
        }
    );
    parsedPlaylist.emptyContent();
    chrome.tabs.executeScript(null, {file: "/js/app/popup/parsePage.js"}, function (parse) {
        _.isUndefined(parse) && $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound({href: window.location.href}))
    });
})
