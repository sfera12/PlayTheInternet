define(["player/iframe-player", "player/iframe-wrapper", "youtube-api", "player/iframe-soundcloud", "player/iframe-vimeo"], function (pti, IframeWrapper) {

    var iw = new IframeWrapper(parent, [window.location.href.replace(/.*\?origin=(.*)/, '$1')])
    iw.listenAllEvents(pti.players) // loadVideo, stopVideo, playVideo, pauseVideo, seekTo, volume

    pti.options.onAfterPlaying = function(boolean) {
        arguments[3] !== 'iframe-wrapper' && iw.postMessage(this.type, this.operation, boolean)
    }
    pti.options.onAfterError = function() {
        iw.postMessage(this.type, this.operation)
    }

    pti.yt.options.onAfterCurrentTime = function (time, playerState) {
        iw.postMessage(this.type, this.operation, time, playerState)
    }
    pti.yt.options.onAfterPlayerState = function (playerState) {
        iw.postMessage(this.type, this.operation, playerState)
    }
    pti.y.options.onAfterDuration = function (duration) {
        iw.postMessage(this.type, this.operation, duration)
    }
    pti.y.options.onAfterPlayerReady = function () {
        iw.postMessage(this.type, this.operation)
    }

    pti.s.options.onAfterPlayerState = function (playerState) {
        iw.postMessage(this.type, this.operation, playerState)
    }
    pti.s.options.onAfterCurrentTime = function (time) {
        iw.postMessage(this.type, this.operation, time)
    }
    pti.s.options.onAfterPlayerReady = function (ready) {
        iw.postMessage(this.type, this.operation, ready)
    }
    pti.s.options.onAfterSoundIndex = function (index) {
        iw.postMessage(this.type, this.operation, index)
    }
    pti.s.options.onAfterDuration = function (duration) {
        iw.postMessage(this.type, this.operation, duration)
    }

    pti.v.options.onAfterPlayerState = function (playerState) {
        iw.postMessage(this.type, this.operation, playerState)
    }
    pti.v.options.onAfterCurrentTime = function (time) {
        iw.postMessage(this.type, this.operation, time)
    }
    pti.v.options.onAfterDuration = function (duration) {
        iw.postMessage(this.type, this.operation, duration)
    }

    return { pti: pti, iw: iw }
})
