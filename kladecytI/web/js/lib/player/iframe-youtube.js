define(["player/iframe-player", "jquery", "underscore"], function (pti, b, c) {
    new pti.Player("y", {
        onBeforePlayerReady:function () {
            return [1]
        },
        onPlayerReady:function (playerapiid) {
            var self = this.scope
            self.playProgressCallbacks = $.Callbacks()
            self.temp.playProgress = function() {
                var duration = youtube.getDuration(),
                    state = youtube.getPlayerState(),
                    currentTime = youtube.getCurrentTime(),
                    duration = youtube.getDuration()
                self.playProgressCallbacks.fire(state, currentTime, duration)
            }
//        console.log(playerapiid)
            console.log('player ready')
        },
        onBeforePlayerState:function (state) {
            return state && state.data != null ? [state.data] : [state]
        },
        onPlayerState:function (state) {
            var self = this.scope
            if (state === 1) {
                pti.nativeRequestPlaying = true
            } else if (state === 2) {
                pti.nativeRequestStop = true
            }
        },
//        onBeforeError:function (error) {
//            return error ? [error.data] : []
//        },
        onStopVideo:function () {
            var self = this.scope
            self.clearTimeout()
            youtube.stopVideo()
        },
        onLoadVideo:function (videoId) {
            var self = this.scope
            youtube.loadVideoById(videoId)
            self.temp.playProgressInterval = setInterval(self.temp.playProgress, 200)
        },
//        onCurrentTime:function (time) {
//            console.log(time)
//        },
        onPlayVideo:function () {
            youtube.playVideo()
        },
        onPauseVideo:function () {
            youtube.pauseVideo()
        },
        onSeekTo:function (seekTo) {
            youtube.seekTo(seekTo)
        },
        onClearTimeout:function () {
            var self = this.scope
            clearInterval(self.temp.playProgressInterval)
        },
        onVolume:function(volume) {
            youtube.unMute()
            _.isUndefined(volume) || youtube.setVolume(volume)
        }
    }, 'youtubeContainer')

    window.onYouTubeIframeAPIReady = function (id) {
        window.youtube = new YT.Player('youtube', {
            height:'100%',
            width:'100%',
            videoId:'MK6TXMsvgQg',
            events:{
                'onReady':pti.yt.playerReady,
                'onStateChange':pti.yt.playerState,
//                'onError':pti.yt.error
            }
        });
    }
})
