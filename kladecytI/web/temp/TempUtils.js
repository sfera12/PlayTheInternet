var urlParams = {};
(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
        urlParams[d(e[1])] = d(e[2]);
})();
//window.location.hash.match(/(#|;)([^=]+)=([^;]+)/g)
//alert(urlParams["auth"]);

//TODO URLSHORTENER
$.ajax({
    url:'https://www.googleapis.com/urlshortener/v1/url',
    type: 'post',
    contentType: 'application/json',
    data:'{"longUrl":"' + window.location.href.substr(0,2039) + '"}',
    success: function() { console.log(arguments); $('#qrcode').empty(); $('#qrcode').qrcode(arguments[0].id)},
    error: function() {console.log(arguments)}
})