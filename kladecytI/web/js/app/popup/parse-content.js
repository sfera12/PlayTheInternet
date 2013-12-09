define(["playlist", "app/chrome/extension"], function(a, extension) {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
            if (request.greeting == "hello")
                sendResponse({farewell:"goodbye"});
            if (request.operation == "parsedPlaylist") {
                request.data != '' ? parsedPlaylist.addSongsToPlaylist(parsedPlaylist.parseSongIds(request.data)) : $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound(request))
            } else if(request.operation == "parsePlayTheInternetParseFunctionMissing") {
                $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing(request))
            }
        }
    );
    chrome.storage.local.get(['parseHeaderOptions'], function (options) {
        options = extension.prepareOptions(options, { size: 'list', split: 'one'})
        window.parsedPlaylist = new Playlist('#parsedPlaylist', {
                elementSize: options.size,
                elementSplit: options.split,
                headerClick: extension.headerClick.bind({parseHeaderOptions: {}}),
                execute: [
                    Playlist.prototype.addAction
                ]
            }
        );
        parsedPlaylist.playlistEmpty();
        chrome.tabs.executeScript(null, {file: "/js/app/popup/parsePage.js"}, function (parse) {
            _.isUndefined(parse) && $('#parsedDiv').append(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound({href: window.location.href}))
        });
    })
})
