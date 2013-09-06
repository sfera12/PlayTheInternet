new pti.Player("y", {
    onPlayerReady:function (playerapiid) {
//        console.log(playerapiid)
        console.log('player ready')
    },
    onBeforePlayerState:function (state) {
        return state ? [state.data] : []
    },
    onPlayerState:function (state) {
        var self = this.scope
        if (state == 1 && pti.blockPlayback()) {
            youtube.stopVideo()
            clearInterval(self.temp['playProgressInterval'])
        } else if (state == 1) {
            self.duration(youtube.getDuration())
            if (self.temp['errorTimeout']) {
                clearTimeout(self.temp['errorTimeout'])
                console.log('no error')
            }
            typeof self.temp['seekToOnce'] == "function" && self.temp['seekToOnce']()
            self.temp['playProgressInterval'] = setInterval(function () {
                self.currentTime(youtube.getCurrentTime())
            }, 750)
        } else if (state == 0) {
            console.log('YT NEXT')
        } else {
            clearInterval(self.temp['playProgressInterval'])
        }
        console.log(state)
    },
    onBeforeError:function (error) {
        return error ? [error.data] : []
    },
    onError:function (error) {
        var scope = this
        self = this.scope
        var callback = this.callback
        clearTimeout(self.temp['errorTimeout'])
        self.temp['errorTimeout'] = setTimeout(function () {
            self.temp['errorTimeout'] = null
            callback.call(scope, error)
            console.log('ERROR NEXT')
        }, 2000)
    },
    onStopVideo:function () {
        youtube.stopVideo()
    },
    onLoadVideo:function (videoId, playerState) {
        var self = this.scope
        self.showPlayer()
        if (pti.blockPlayback()) {
            youtube.stopVideo()
        } else {
            self.temp['seekToOnce'] = null
            if (playerState) {
                self.temp['seekToOnce'] = _.once(function () {
                    youtube.seekTo(playerState.start)
                })
                youtube.loadVideoById(videoId)
            } else {
                youtube.loadVideoById(videoId)
            }
        }
//        console.log('load video')
    },
    onCurrentTime:function (time) {
//        console.log(time)
    },
    onPlayVideo:function () {
        youtube.playVideo()
    },
    onPauseVideo:function () {
        youtube.pauseVideo()
    },
    onSeekTo:function(seekTo) {
        youtube.seekTo(seekTo)
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
            'onError':pti.yt.error
        }
    });
}