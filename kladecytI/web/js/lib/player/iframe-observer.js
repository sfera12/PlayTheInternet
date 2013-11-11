define(["pti-abstract", "iframe-wrapper", "jquery", "underscore"], function (PTI, IframeWrapper, $, _) {
    var iframeContainer = $('#players')
    var reinitInterval = 120 * 60000
    var initTimeout = 30000
    var playerIframe
    var playerIframeHosts
    var afterPlayerReady

    function appendIframe() {
        iframeContainer.html('<iframe class="leftFull temp-border-none temp-width-hundred-percent" src="http://playtheinternet.appspot.com/iframe-player.html?origin=' + window.location.href +  '"></iframe>')
        playerIframe = iframeContainer.find('iframe')[0].contentWindow
        playerIframeHosts = ["http://playtheinternet.appspot.com"]

        var observerReady = false
        var readyCallbacks = []

        ready = function ready(callback) {
            if (_.isUndefined(callback) && observerReady) {
                for (var i = 0; i < readyCallbacks.length; i++) {
                    readyCallbacks[i]()
                }
            } else {
                _.isFunction(callback) && readyCallbacks.push(callback) && observerReady && callback()
            }
        }

        afterPlayerReady = _.after(2, function () {
            observerReady = true
            ready()
            lastReady = new Date().getTime()
        })
    }

    var lastReady = 0
    var initAndListen = _.throttle(function () {
        reinit()
        clearTimeout(initFailTimeout)
        var initFailTimeout = setTimeout(function () {
            console.log('failed to init players in observer, retrying')
            initAndListen()
        }, initTimeout + 1000)
        ready(function () {
            clearTimeout(initFailTimeout)
            pti.blockPlayback(pti.blockPlayback()) //resend current status to iframe-observable
            var loadVideo = pti.loadVideo()
            iw.postMessage('pti', 'loadVideo', loadVideo[0], loadVideo[1], loadVideo[2])
        })
    }, initTimeout, {trailing: false})
    var lazyLoadVideo = function (thistype, thisoperation, type, videoId, playerState) {
        var now = new Date().getTime()
        if (now - lastReady >= reinitInterval) {
            initAndListen()
        } else {
            iw.postMessage(thistype, thisoperation, type, videoId, playerState)
        }
    }

    pti = new PTI({
        onBlockPlayback: function (blockPlayback) {
            iw.postMessage(this.type, this.operation, blockPlayback)
        },
        onLoadVideo: function (type, videoId, playerState) {
            (!_.isUndefined(type) || !_.isUndefined(videoId)) && lazyLoadVideo(this.type, this.operation, type, videoId, playerState)
        },
        onPlayVideo: function () {
            iw.postMessage(this.type, this.operation)
        },
        onPauseVideo: function () {
            iw.postMessage(this.type, this.operation)
        },
        onSeekTo: function (seekTo) {
            iw.postMessage(this.type, this.operation, seekTo)
        }
    })

    new pti.Player('y', {
        onLoadVideo: function (videoObject, playerState) {
            iw.postMessage(this.type, this.operation, videoObject, playerState)
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
        onError: function (error) {
            SiteHandlerManager.prototype.stateChange('ERROR')
        },
        onPlayerReady: function (playerState) {
            afterPlayerReady()
        }
    })
    new pti.Player('s', {
        onLoadVideo: function (videoId, playerState) {
            iw.postMessage(this.type, this.operation, videoId, playerState)
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
            afterPlayerReady()
        },
        onError: function (error) {
            SiteHandlerManager.prototype.stateChange('ERROR')
        }
    })
    new pti.Player('v', {
        onLoadVideo: function (videoId, playerState) {
            iw.postMessage(this.type, this.operation, videoId, playerState)
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
        onError: function (error) {
            SiteHandlerManager.prototype.stateChange('ERROR')
        }
    })

    function init() {
        appendIframe()
        initIframeWrapper()
    }

    var initIframeWrapper = function () {
        instantiateIframeWrapper()
        iw.iframe = playerIframe
    }

    var instantiateIframeWrapper = _.once(function () {
        iw = new IframeWrapper(playerIframe, playerIframeHosts)
        iw.listenAllEvents(pti.players)
    })

    function destroy() {
        iframeContainer.empty()
    }

    function reinit() {
        destroy()
        appendIframe()
        initIframeWrapper()
    }

    var pti;
    var iw;
    var ready;

    return {pti: pti, iw: iw, ready: ready, init: init, destroy: destroy, reinit: reinit}
})
