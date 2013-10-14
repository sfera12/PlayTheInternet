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
iframeWin.postMessage(document.documentElement.innerHTML, "http://localhost:8888");

_.uniq(_.flatten(_.reduce(sortedData, function(memo, item) { memo.push(item.data); return memo }, new Array())), function(item) { return item.type + '=' + item.id } )

// RELATED START

var uploadVideo = function() {
    var feedRequest = '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:batch="http://schemas.google.com/gdata/batch" xmlns:yt="http://gdata.youtube.com/schemas/2007"><batch:operation type="update"/><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry><entry><batch:operation type="insert"/><id>sCKe65D-uyo</id></entry></feed>'
    $.ajax({
        // url : 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&start-index=1&max-results=50&q=asking%20alexandria&orderby=relevance',
        // url : 'https://gdata.youtube.com/feeds/api/videos/' + currId + '/related?v=2&alt=jsonc&max-results=' + maxRes,
        url : 'kladecyt',
        type: 'POST',
        headers: { 'Bearer': gAuth},
        data: feedRequest,
        success : function(){ alert('success')},
        error : aError
    })
}

var batchWrapper = function() {
    setTimeout(batch, "60000")
}

var batchI = 0;
var batch = function() {
    if(batchI < 200 && batchI < songs.length) {
        console.log('batchI ' + batchI)
        console.log('songs.length ' + songs.length)
        var feedStart = '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:batch="http://schemas.google.com/gdata/batch" xmlns:yt="http://gdata.youtube.com/schemas/2007"><batch:operation type="update"/>'
        var feedEnd = '</feed>'
        var end = batchI + 40
        for (var i=batchI; i < end && i < songs.length && i < 200; i++, batchI++) {
            var entry = '<entry><batch:operation type="insert"/><id>' + songs[i] + '</id></entry>'
            feedStart += entry
        };
        console.log(feedStart + feedEnd)
        $.ajax({
            // url : 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&start-index=1&max-results=50&q=asking%20alexandria&orderby=relevance',
            // url : 'https://gdata.youtube.com/feeds/api/videos/' + currId + '/related?v=2&alt=jsonc&max-results=' + maxRes,
            url : 'kladecyt',
            type: 'POST',
            headers: { 'Bearer': gAuth},
            data: feedStart + feedEnd,
            success : batchWrapper,
            error : aError
        })
    } else {
        console.log('done with')
        console.log('batchI ' + batchI)
        console.log('songs.length ' + songs.length)
    }
}

var related = function(maxRes) {
    if(recDepth > 0) {
        $.each(currIteration, function(index, currId) {
            // console.log('related ' + currIteration.length)
            $.ajax({
                // async: false,
                // url : 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&start-index=1&max-results=50&q=asking%20alexandria&orderby=relevance',
                url : 'https://gdata.youtube.com/feeds/api/videos/' + currId + '/related?v=2&alt=jsonc&max-results=' + maxRes,
                // dataType : 'json',
                success : addSongs,
                error : aError
            })
        });
    } else {
        console.log(songs.length)
        console.log(songs.unique().length)
        songs = songs.unique()
        batch(0)
    }
}



var addSongs = function(data) {
    currLength++
    $.each(data.data.items, function(index, item) {
        songs.push(item.id)
        nextIteration.push(item.id)
        console.log(item.id)
    })
    // console.log('addSongs ' + currIteration.length)
    if(currLength == currIteration.length) {
        currLength = 0
        console.log('currIteration')
        recDepth--
        currIteration = nextIteration
        nextIteration = []
        related(maxRes)
    }
}

var vId = $('#iCriteria').attr('value')
var maxRes = 15;
var recDepth = 2;

var currIteration = []
var currLength = 0;
var nextIteration = []
var songs = new Array()

songs.push(vId)
currIteration.push(vId)
$("#iRelated").click(function() {
    related(maxRes)
});

$("#iUploadVideo").click(function() {
    uploadVideo()
});

// RELATED END

//oauth2callback
<script language="Javascript" type="text/javascript">
var hash = location.hash.substr(1)
var token = hash.substr(hash.indexOf('access_token=')).split('&')[0].split('=')[1]
window.opener.document.getElementById("iLogin").value = 'sichain'
window.opener.document.getElementById("iToken").value = token
window.close()
</script>