define('hash-qr', ['underscore', 'tabs'], function (_) {
    function buildQR() {
        var location = window.location.href.replace(/chrome-extension:\/\/[^\/]+/, 'http://playtheinternet.appspot.com').substr(0, 2039)
        $.ajax({
            url:'https://www.googleapis.com/urlshortener/v1/url',
            type:'post',
            contentType:'application/json',
            data:'{"longUrl":"' + location + '"}',
            success:function () {
                console.log(arguments);
                $('#qrcode').empty();
                $('#qrcode').qrcode(arguments[0].id)
            },
            error:function () {
                console.log('buildqr error');
                console.log(arguments)
            }
        })
    }

    function redrawHashAndQRCode() {
        if (typeof playlist != "undefined") {
            window.location.hash = playlist.jPlaylist.sortable('toArray')
        }
        if ($("#tabs").tabs("option", "active") == 2) {
            require(['qrcode'], function () {
                buildQR()
            })
        }
    }

    return redrawHashAndQRCode
})
