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
watch(([^ \'\'<>]+v=)|(\u0025253Fv\u0025253D))
http://www.youtube.com/attribution_link?a=YFxsWIwpFY035tQrnCYesw&u=%2Fwatch%3Fv%3D2O2Aec2o-4w%26feature%3Dshare

//TODO youtube not available in your country
http://www.youtube.com/watch?v=UdB76CMH4rM

//TODO sc secret token
http://www.nzherald.co.nz/entertainment/news/article.cfm?c_id=1501119&objectid=11138866

//TODO vimeo
http://noisey.vice.com/blog/meet-the-two-scottish-rappers-who-conned-the-world

//TODO exclude soundcloud
https://soundcloud.com/.../on-the-block-prod-by-boi-ape …

//TODO play button status highlight
    <div class="button play" style="
    /* background-color: black; */
"><div style="
    width: 39px;
    height: 39px;
    border-radius: 50%;
    background-color: black;
    position: relative;
    z-index: -1;
              "></div><div style="
    /* display: none; */
    width: 39px;
    height: 39px;
    background-color: white;
    position: absolute;
    z-index: -2;
    top: 0px;
"></div></div>

//TODO download logs
C:\java\jdks\appengine-java-sdk-1.7.3\bin>appcfg.cmd --num_days=2  request_logs "C:\java\svn\kladecytI\out\artifacts\kladecyt_war_exploded" asdf.txt

