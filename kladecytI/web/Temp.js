javascript: (function () {
    if (typeof(playTheInternetParse) == "undefined") {
        var parse = document.createElement('script');
        parse.src = "http://localhost:8888/parse.js";
        document.getElementsByTagName('head')[0].appendChild(parse);
    }

    function parsePage() {
        setTimeout(function () {
            if (typeof(playTheInternetParse) != "undefined") {
                openWindow(playTheInternetParse());
            } else {
                parsePage();
            }
        }, 100)
    }

    function openWindow(links) {
        var a = window,
            b = document,
            c = encodeURIComponent,
            d = a.open('http://localhost:8888/parse.html#' + links, 'bkmk_popup', 'left=' + ((a.screenX || a.screenLeft) + 10) + ',top=' + ((a.screenY || a.screenTop) + 10) + ',height=300px,width=750px,resizable=1,alwaysRaised=1');
        a.setTimeout(function () {
            d.focus();
        }, 300)
    }

    parsePage();
})();

var xhr = new XMLHttpRequest();
var path="http://localhost:8888/channel";
xhr.open('post', path, false);
xhr.send();
token=xhr.responseText;
caughtMsg=token+" *** ";
var onMessage = function() { console.log("onmessage")};
var channel = new goog.appengine.Channel(token);
var handler = {
    'onopen': function(){caughtMsg+=" *** open";},
    'onmessage': onMessage,
    'onerror': function(e){caughtMsg+=" *** err "+e.description+" "+e.code},
    'onclose': function(){caughtMsg+=" *** close";}
};
var socket = channel.open(handler);
socket.onmessage = onMessage;



var channel = new goog.appengine.Channel(token);
var socket = channel.open();

// http://www.iconarchive.com/show/nod-icons-by-rimshotdesign/Network-icon.html

//todo parse twitter links http://t.co/xFkhzLg00G

function createIframe(url) {
    var iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.name = "da-iframe"
    iframe.id = "da-iframe"
    document.body.appendChild(iframe);
    return frames["da-iframe"].location.host;
}
createIframe("http://localhost:8888/linkRenderer.html");

var iframeWin = document.getElementById("da-iframe").contentWindow
iframeWin.postMessage("RECEIVED", "http://localhost:8888");