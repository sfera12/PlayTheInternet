function playTheInternetParse(htmlText) {
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
    var youtube = /(youtu.be(\/|\u00252F)|watch[^ \'\'<>]+v=|youtube.com\/embed\/|youtube.com\/v\/)([^ &\'\'<>\/\\.]{11})/g;
    var youtubeLinks = htmlText.match(youtube);
    var uTubeLinks = youtubeLinks.unique();
    var result = '';
    for (var i = 0; i < uTubeLinks.length; i++) {
        result += 'y=' + uTubeLinks[i].replace(youtube, '$3') + ',';
    }
    return result;
}
function parsePage() {
    openWindow(playTheInternetParse());
}
function openWindow(links) {
    var a = window,
        b = document,
        c = encodeURIComponent,
        d = a.open('DOMAIN/parse.html#' + links, 'bkmk_popup', 'left=' + ((a.screenX || a.screenLeft) + 10) + ',top=' + ((a.screenY || a.screenTop) + 10) + ',height=300px,width=750px,resizable=1,alwaysRaised=1');
    a.setTimeout(function () {
        d.focus();
    }, 300)
}
