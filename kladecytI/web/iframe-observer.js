var pti = new PTI({onBlockPlayback:function (blockPlayback) {
    iw.postMessage(this.type, this.operation, blockPlayback)
}})

var playerIframe = $('iframe')[0].contentWindow
var playerIframeHosts = ["http://localhost:8888", "http://playtheinternet.appspot.com"]
//var playerIframeHosts = ["http://playtheinternet.appspot.com"]

new pti.Player('y', {
    onLoadVideo:function (videoObject, playerState) {
        iw.postMessage(this.type, this.operation, videoObject, playerState)
    },
    onStopVideo:function () {
        iw.postMessage(this.type, this.operation)
    },
    onCurrentTime:function (time) {
    },
    onPlayerState:function (state) {
        if (state == 0) {
            SiteHandlerManager.prototype.stateChange('NEXT')
        }
    },
    onError:function (error) {
        SiteHandlerManager.prototype.stateChange('ERROR')
    }
})


var iw = new IframeWrapper(playerIframe, playerIframeHosts)
iw.listenAllEvents(pti)     //currentTime, error, playerState
