function playTheInternetParseTemp(htmlText) {
    Array.prototype.unique = function () {
        var newarr = [];
        var unique = {};

        this.forEach(function (item) {
            if (!unique[item.id]) {
                newarr.push(item);
                unique[item.id] = item;
            }
        });
        return newarr;
    };
    if(htmlText == null) {
        htmlText = document.documentElement.innerHTML;
    }
    var youtube = /thisisregex/g;
    var local = /thisisregex/;
    var youtubeLinks = htmlText.match(youtube);
    var result = new Array();
    for (var i = 0; i < youtubeLinks.length; i++) {
        youtubeLinks[i].replace(local,
        'matchfunction'
        );
    }
    result = result.unique();
    var hash = '';
    result.forEach(function(item) {
        hash += item.type + '=' + item.id + ',';
    });
    return hash;
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
        return "if(match.match(local)[" + group + "] != undefined) { result.push({type: '" + prefix + "', id:  match.replace(local, '$" + group + "')})}"
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
        d = a.open('DOMAIN/parse.html?location=' + encodeURI(window.location.href.replace(/#/g, '&hash;')) + '#' + links, 'bkmk_popup', 'left=' + ((a.screenX || a.screenLeft) + 10) + ',top=' + ((a.screenY || a.screenTop) + 10) + ',height=530px,width=1100px,resizable=1,alwaysRaised=1');
    a.setTimeout(function () {
        d.focus();
    }, 300)
}
