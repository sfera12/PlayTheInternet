define(["pti-abstract", "iframe-wrapper", "jquery"], function (PTI, IframeWrapper, $) {
    $('#players').html('<iframe class="leftFull temp-border-none temp-width-hundred-percent" src="http://localhost:8888/iframe-player.html"></iframe>')
    var pti = new PTI({
        onBlockPlayback:function (blockPlayback) {
            iw.postMessage(this.type, this.operation, blockPlayback)
        },
        onLoadVideo:function (type, videoId, playerState) {
            iw.postMessage(this.type, this.operation, type, videoId, playerState)
        },
        onPlayVideo:function () {
            iw.postMessage(this.type, this.operation)
        },
        onPauseVideo:function () {
            iw.postMessage(this.type, this.operation)
        },
        onSeekTo:function (seekTo) {
            iw.postMessage(this.type, this.operation, seekTo)
        }
    })

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
    new pti.Player('s', {
        onLoadVideo:function (videoId, playerState) {
            iw.postMessage(this.type, this.operation, videoId, playerState)
        },
        onInitializePlayer:function () {
            iw.postMessage(this.type, this.operation)
        },
        onCurrentTime:function (time) {
//        console.log('from main')
//        console.log(time)
        },
        onPlayerState:function (state) {
            if (state == 0) {
                SiteHandlerManager.prototype.stateChange('NEXT')
            }
        }
    })
    new pti.Player('v', {
        onLoadVideo:function (videoId, playerState) {
            iw.postMessage(this.type, this.operation, videoId, playerState)
        },
        onCurrentTime:function (time) {
//        console.log('from main')
//        console.log(time)
        },
        onPlayerState:function (state) {
            if (state == 0) {
                SiteHandlerManager.prototype.stateChange('NEXT')
            }
        }
    })

    iw = new IframeWrapper(playerIframe, playerIframeHosts)
    iw.listenAllEvents(pti.players)     //currentTime, error, playerState
    return {pti: pti, iw: iw}
})
