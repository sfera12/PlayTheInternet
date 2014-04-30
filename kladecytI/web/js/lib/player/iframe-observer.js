define(["player/pti-abstract", "player/iframe-wrapper", "jquery", "underscore"], function (PTI, IframeWrapper, c, d) {
    var host = "localhost:8888"
//    var host = "0-66.playtheinternet.appspot.com"
//        var host = "playtheinternet.appspot.com"
//        var host = "web.playtheinter.net"
    var iframeContainer = $('#players'), playerIframeHosts = ["http://" + host], playerIframe, iw
    var lastReady = 0, reinitInterval = 120 * 60000, initTimeout = 30000
    var youtubeReady, soundcloudReady

    function appendIframe() {
        iframeContainer.html('<iframe class="leftFull temp-border-none temp-width-hundred-percent" src="http://' + host + '/iframe-player.html?origin=' + window.location.href + '"></iframe>')
        playerIframe = iframeContainer.find('iframe')[0].contentWindow

        youtubeReady = new $.Deferred()
        soundcloudReady = new $.Deferred()
    }

    var initAndListen = _.throttle(function () {
        reinit()
        clearTimeout(initFailTimeout)
        var initFailTimeout = setTimeout(function () {
            console.log('failed to init players in observer, retrying')
            initAndListen()
        }, initTimeout + 500)
        $.when(youtubeReady, soundcloudReady).then(function () {
            clearTimeout(initFailTimeout)
//            pti.playing(pti.playing()) //resend current status to iframe-observable or remove this line
            var loadVideo = pti.loadVideo()
            iw.postMessage('pti', 'loadVideo', loadVideo[0], loadVideo[1], loadVideo[2])
            lastReady = Date.now()
        })
    }, initTimeout, {trailing: false})

    function lazyLoadVideo(thistype, thisoperation, type, videoId, playerState) {
        if (Date.now() - lastReady >= reinitInterval) {
            initAndListen()
        } else {
            iw.postMessage(thistype, thisoperation, type, videoId, playerState)
        }
    }

    var pti = new PTI({
        onLoadVideo: function (type, videoId, playerState) {
            !_.isUndefined(type) && !_.isUndefined(videoId) && lazyLoadVideo(this.type, this.operation, type, videoId, playerState)
        },
        onPlayVideo: function () {
            iw.postMessage(this.type, this.operation)
        },
        onPauseVideo: function () {
            iw.postMessage(this.type, this.operation)
        },
        onSeekTo: function (seekTo) {
            iw.postMessage(this.type, this.operation, seekTo)
        },
        onVolume: function (volume) {
            iw.postMessage(this.type, this.operation, volume)
        },
        onError: function () {
            SiteHandlerManager.prototype.stateChange('ERROR')
        }
    })

    new pti.Player('y', {
        onLoadVideo: function (videoObject) {
            iw.postMessage(this.type, this.operation, videoObject)
        },
        onStopVideo: function () {
            iw.postMessage(this.type, this.operation)
        },
        onCurrentTime: function (time) {
        },
        onPlayerState: function (state) {
            if (state == 0) {
                SiteHandlerManager.prototype.stateChange('NEXT')
            }
        },
        onPlayerReady: function (playerState) {
            youtubeReady.resolve()
        }
    })
    new pti.Player('s', {
        onLoadVideo: function (videoId) {
            iw.postMessage(this.type, this.operation, videoId)
        },
        onInitializePlayer: function () {
            iw.postMessage(this.type, this.operation)
        },
        onCurrentTime: function (time) {
//        console.log('from main')
//        console.log(time)
        },
        onPlayerState: function (state) {
            if (state == 0) {
                SiteHandlerManager.prototype.stateChange('NEXT')
            }
        },
        onPlayerReady: function (playerState) {
            soundcloudReady.resolve()
        }
    })
    new pti.Player('v', {
        onLoadVideo: function (videoId) {
            iw.postMessage(this.type, this.operation, videoId)
        },
        onCurrentTime: function (time) {
//        console.log('from main')
//        console.log(time)
        },
        onPlayerState: function (state) {
            if (state == 0) {
                SiteHandlerManager.prototype.stateChange('NEXT')
            }
        }
    })

    function init() {
        appendIframe()
        initIframeWrapper()
    }

    function initIframeWrapper() {
        instantiateIframeWrapper()
        iw.iframe = playerIframe
    }

    var instantiateIframeWrapper = _.once(function () {
        iw = new IframeWrapper(playerIframe, playerIframeHosts)
        iw.listenAllEvents(pti.players)
    })

    function destroy() {
        iframeContainer.find('iframe').attr('src', null)
        iframeContainer.empty()
    }

    function reinit() {
        destroy()
        appendIframe()
        initIframeWrapper()
    }

    return { pti: pti, iw: iw, init: init, destroy: destroy, reinit: reinit }
})
