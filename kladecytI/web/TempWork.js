chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        details.requestHeaders.push({name: "Referer", value: "chrome-extension://hnelbfkfkaieecemgnpkpnopdpmffkii/"})
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["requestHeaders"]);

//TODO strange vimeo player, check for seekTo and other methods
http://vimeo.com/67160485#

_.flatten(_.reduce(sortedData, function (memo, item) {
    _.each(item.data, function (item) {
        item.date = this.meta.date
    }, item)
    memo.push(item.data);
    return memo
}, new Array()))

DPGlobal.parseDate($('#start').val(), DPGlobal.parseFormat('dd-mm-yyyy'))

--address=192.168.1.99

var matchTextRegExp = new RegExp("выборы", "gi")
var matchText = function(node) { return $(node).text().match(matchTextRegExp) != null ? true : false }
var selectMatched = function(node, matchText) { if(matchText(node)) { $(node).addClass('ui-selected') } }
_.each(calendarPlaylist.playlist, function(item) {  })

//TODO youtube parse
http://www.youtube.com/attribution_link?a=YFxsWIwpFY035tQrnCYesw&u=%2Fwatch%3Fv%3D2O2Aec2o-4w%26feature%3Dshare