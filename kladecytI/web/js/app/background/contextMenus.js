define(function() {
    function parse(concat) {
        require(['cparse'], function () {
            var ids = playTheInternetParse(concat);
            console.log(ids)
            addToPlaylist(ids)
        })
    }

    function addToPlaylist(ids) {
        var links = []
        ids.length && (links = playlist.parseSongIds(ids)) | playlist.addSongsToPlaylist(links, true)
        notify(links)
    }

    function notify(links) {
        if (links.length) {
            chrome.notifications.create('', {
                type: "basic",
                title: "Found " + links.length + " tracks!",
                message: "Adding tracks to PlayTheInternet. Remember that duplicate tracks won't be added!",
                iconUrl: "favicon.ico"
            }, function () {
                console.log()
            })
        } else {
            chrome.notifications.create('', {
                type: "basic",
                title: "Nothing!",
                message: "Couldn't find tracks.",
                iconUrl: "/css/resources/nothing.png"
            }, function () {
                console.log()
            })
        }
    }

    function parseText(info, tab) {
        console.log("item " + info.menuItemId + " was clicked");
//        var info = JSON.stringify(info);
//        var tab = JSON.stringify(tab);
//        console.log("info: " + info);
//        console.log("tab: " + tab);
//        var concat = info + ' ' + tab;
        var concat = info.linkUrl;
        console.log(JSON.stringify(info) + '\r\n' + JSON.stringify(tab));
        parse(concat);
    }

    function parsePage() {
        console.log(chrome.tabs)
        chrome.tabs.executeScript(null, {file: "/js/app/background/parsePage.js"}, function(executeSuccess) {
            _.isUndefined(executeSuccess) && parse('')
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
                console.log(request.data)
                addToPlaylist(request.data)
            } else if(request.operation == "parsePageParsePlayTheInternetParseFunctionMissing") {
                chrome.notifications.create('', {
                    type: "basic",
                    title: "Refresh this tab!",
                    message: "Please refresh(F5) current tab:\r\n" + request.href,
                    iconUrl: "/css/resources/nothing.png"
                }, function () {
                    console.log()
                })
            }
        }
    );

    chrome.contextMenus.create({"title": 'Add link to PlayTheInternet', "contexts":['link'], "onclick": parseText});
    chrome.contextMenus.create({"title": 'Add selected text to PlayTheInternet', "contexts":['selection'], "onclick": parseText});
    chrome.contextMenus.create({"title": 'Add everything from this page', "contexts":['page'], "onclick": parsePage});
})
