var pti = new PTI({blockPlaybackCallback:[function (blockPlayback) {
    iw.postMessage('pti', 'blockPlayback', blockPlayback)
}]})

var playerIframe = $('iframe')[0].contentWindow
var playerIframeHosts = ["http://localhost:8888", "http://playtheinternet.appspot.com"]
//var playerIframeHosts = ["http://playtheinternet.appspot.com"]

new pti.Player('y', {
    loadVideoCallback:[function (videoObject, playerState) {
        iw.postMessage('y', 'loadVideo', videoObject, playerState)
    }],
    stopVideoCallback:[function () {
        iw.postMessage('y', 'stopVideo')
    }],
    currentTimeCallback:[function (time) {
    }],
    playerStateCallback:[function (state) {
        if (state == 0) {
            SiteHandlerManager.prototype.stateChange('NEXT')
        }
    }],
    errorCallback:[function (error) {
        SiteHandlerManager.prototype.stateChange('ERROR')
    }]
})


var iw = new IframeWrapper(playerIframe, playerIframeHosts)
iw.listenAllEvents(pti)     //currentTime, error, playerState
