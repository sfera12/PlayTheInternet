var pti = new PTI({blockPlaybackCallback:[function (blockPlayback) {
    iw.postMessage('pti', 'blockPlayback', blockPlayback)
}]})

var playerIframe = $('iframe')[0].contentWindow
var playerIframeHosts = ["http://localhost:8888", "http://playtheinternet.appspot.com"]

new pti.Player('y', {
    loadVideoCallback:[function (videoObject, playerState) {
        iw.postMessage('y', 'loadVideo', videoObject, playerState)
    }],
    stopVideoCallback:[function () {
        iw.postMessage('y', 'stopVideo')
    }],
    currentTimeCallback:[function (time) {
        console.log('observer time')
    }]
})


var iw = new IframeWrapper(playerIframe, playerIframeHosts)
iw.addEvent('y', 'currentTime', function (time) {
    pti['y'].currentTime(time)
})
iw.addEvent('y', 'error', function (error) {
    pti['y'].error(error)
})
iw.addEvent('y', 'playerState', function (playerState) {
    pti['y'].playerState(playerState)
})


