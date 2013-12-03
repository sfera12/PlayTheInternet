define(function() {
    function genericOnClick(info, tab) {
        console.log("item " + info.menuItemId + " was clicked");
        var info = JSON.stringify(info);
        var tab = JSON.stringify(tab);
        console.log("info: " + info);
        console.log("tab: " + tab);
        var concat = info + ' ' + tab;
        require(['cparse'], function() {
            var ids = playTheInternetParse(concat);
            console.log(ids)
            if (ids.length > 0) {
                var links = playlist.parseSongIds(ids);
                chrome.notifications.create('', {
                    type: "basic",
                    title: "Found " + links.length + " tracks!",
                    message: "Adding tracks to PlayTheInternet. Remember that duplicate tracks won't be added!",
                    iconUrl: "favicon.ico"
                }, function() {console.log()})
                playlist.addSongsToPlaylist(links, true)
            } else {
                chrome.notifications.create('', {
                    type: "basic",
                    title: "Nothing!",
                    message: "Couldn't find tracks.",
                    iconUrl: "/css/resources/nothing.png"
                }, function() {console.log()})            }
        })
    }
    function parsePage() {
        console.log(chrome.tabs)
        chrome.tabs.executeScript(null, {file: "/js/app/background/parsePage.js"}, function(parse) {
            _.isUndefined(parse) && (console.log('nothing found because chrome tabs'))
        })
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
//                    console.log(sender.tab ?
//                        "from a content script:" + sender.tab.url :
//                        "from the extension");
            if (request.greeting == "hello")
                sendResponse({farewell:"goodbye"});
            if (request.operation == "parsePage") {
                if(request.data == ''){
//                    $('#parsedDiv').html(PTITemplates.prototype.ParsePlayTheInternetParseNothingFound(request))
                    console.log('nothing found')
                } else {
                    playlist.addSongsToPlaylist(playlist.parseSongIds(request.data), true)
                }
            } else if(request.operation == "parsePageParsePlayTheInternetParseFunctionMissing") {
                alert('context menu playtheinternet parse function missing')
//                $('#parsedDiv').html(PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing(request))
            }
        }
    );

    chrome.contextMenus.create({"title": 'Add link to PlayTheInternet', "contexts":['link'], "onclick": genericOnClick});
    chrome.contextMenus.create({"title": 'Add everything from this page', "contexts":['page'], "onclick": parsePage});
})
