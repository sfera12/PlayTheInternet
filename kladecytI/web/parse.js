function playTheInternetParseTemp(htmlText) {
    Array.prototype.unique = function (a) {
        return function () {
            return this.filter(a)
        }
    }(function (a, b, c) {
        return c.indexOf(a) == b
    });
    if(htmlText == null) {
        htmlText = document.documentElement.innerHTML;
    }
    var youtube = /thisisregex/g;
    var local = /thisisregex/;
    var youtubeLinks = htmlText.match(youtube);
    var uTubeLinks = youtubeLinks.unique();
    var result = '';
    for (var i = 0; i < uTubeLinks.length; i++) {
        result += uTubeLinks[i].replace(local,
        'matchfunction'
        ) + ',';
    }
    return result;
}

(function () {
    var regexs = $.map(siteHandlers,function (item) {
        var regex = String(item.__proto__.regex)
        return("(" + regex.substring(1).substring(0, regex.length - 2) + ")")
    }).join("|")
    var matchFunction = "function(match) {"
    var lastGroupCount = 0;
    var ifs = $.map(siteHandlers,function (item, index) {
        var regex = String(item.__proto__.regex)
        var group = item.__proto__.regexGroup + index + 1 + lastGroupCount;
        var groupCount = regex.split('(').length - 1
        lastGroupCount = lastGroupCount + groupCount
        var prefix = item.__proto__.prefix;
        return "if(match.match(local)[" + group + "] != undefined) { return match.replace(local, '" + prefix + "=$" + group + "')}"
    }).join(';')
    matchFunction = matchFunction + ifs + '}'
    var playTheInternetParseString = String(window.playTheInternetParseTemp)
    playTheInternetParseString = playTheInternetParseString
        .replace(/thisisregex/g, regexs)
        .replace(/'matchfunction'/, matchFunction)
        .replace(/Temp/, '')
    console.log(playTheInternetParseString)
    eval("window.playTheInternetParse = " + playTheInternetParseString)
})()

function parsePage() {
    openWindow(playTheInternetParse());
}
function openWindow(links) {
    var a = window,
        b = document,
        c = encodeURIComponent,
        d = a.open('DOMAIN/parse.html#' + links, 'bkmk_popup', 'left=' + ((a.screenX || a.screenLeft) + 10) + ',top=' + ((a.screenY || a.screenTop) + 10) + ',height=530px,width=1100px,resizable=1,alwaysRaised=1');
    a.setTimeout(function () {
        d.focus();
    }, 300)
}
