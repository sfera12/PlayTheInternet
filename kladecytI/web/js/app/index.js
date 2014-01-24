define(['parse', 'jquery', 'underscore'], function (a, b, c) {
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

    $(document).ready(function () {
        $('#holder').attr('href', 'javascript: (function() {' + playTheInternetParse + openWindow + parsePage + ';parsePage()})()')
        $('#local').attr('href', $('#holder').attr('href')
            .replace(/DOMAIN/g, 'http://localhost:8888')
        )
        $('#99').attr('href', $('#holder').attr('href')
            .replace(/DOMAIN/g, 'http://192.168.1.99:8888')
        )
        $('#production').attr('href', $('#holder').attr('href')
            .replace(/DOMAIN/g, 'http://playtheinternet.appspot.com')
        )
    })
})