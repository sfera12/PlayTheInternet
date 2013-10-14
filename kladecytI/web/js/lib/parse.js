define(['sitehandlers', 'jquery'], function(a, $) {
    function playTheInternetParseTemp(htmlText) {
        var unique = function (arr) {
            var newarr = [];
            var unique = {};

            arr.forEach(function (item) {
                item.id = item.id.replace(/\\/g, '').replace(/\u00252F/g, '/');
                if (!unique[item.id]) {
                    newarr.push(item);
                    unique[item.id] = item;
                }
            });
            return newarr;
        };
        if (htmlText == null) {
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
        result = unique(result);
        var hash = '';
        result.forEach(function (item) {
            hash += item.type + '=' + item.id + ',';
        });
        return hash;
    }

    (function () {
        var regexs = $.map(siteHandlers,function (item) {
            var regex = String(item.__proto__.regex)
            //remove '/' regex wrappers and wrap in group '()'
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
        var playTheInternetParseString = String(playTheInternetParseTemp)
        playTheInternetParseString = playTheInternetParseString
            .replace(/thisisregex/g, regexs)
            .replace(/'matchfunction'/, matchFunction)
            .replace(/Temp/, '')
        console.log(playTheInternetParseString)
        window.playTheInternetParse = new Function(["htmlText"], playTheInternetParseString.replace(/[^f]*function[^p]+playTheInternetParse[^{]+{[^\w]*((.*((\r\n)|\r|\n))*).*}.*$/, '$1'))
    })()

    return {playTheInternetParse:window.playTheInternetParse}
})
