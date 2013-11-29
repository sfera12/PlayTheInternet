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
                chrome.notifications.create('', {
                    type: "basic",
                    title: "Found!",
                    message: "Adding tracks to PlayTheInternet. Won't add duplicates!",
                    iconUrl: "favicon.ico"
                }, function() {console.log()})
                playlist.addSongsToPlaylist(playlist.parseSongIds(ids), true)
            } else {
                chrome.notifications.create('', {
                    type: "basic",
                    title: "Nothing!",
                    message: "Couldn't find tracks.",
                    iconUrl: "/css/resources/nothing.png"
                }, function() {console.log()})            }
        })
    }
    chrome.contextMenus.create({"title": 'Add to PlayTheInternet', "contexts":['link'], "onclick": genericOnClick});
})
