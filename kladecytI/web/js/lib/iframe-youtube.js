define('youtube', ["pti", "jquery", "underscore"], function (pti, $, _) {
    new pti.Player("y", {
        onBeforePlayerReady:function () {
            return [1]
        },
        onPlayerReady:function (playerapiid) {
//        console.log(playerapiid)
            console.log('player ready')
        },
        onBeforePlayerState:function (state) {
            return state && state.data != null ? [state.data] : [state]
        },
        onPlayerState:function (state) {
            var self = this.scope
            if (state == 1 && pti.blockPlayback()) {
                youtube.stopVideo()
                clearInterval(self.temp.playProgressInterval)
            } else if (state == 1) {
                self.duration(youtube.getDuration())
                if (self.temp.errorTimeout) {
                    clearTimeout(self.temp.errorTimeout)
                    console.log('no error')
                }
                self.temp.playProgressInterval = setInterval(function () {
                    _.isFunction(self.temp.debouncePlayProgress) && self.temp.debouncePlayProgress()
                    self.currentTime(youtube.getCurrentTime()) //for cursor in playerWidget (this one is necessary)
                }, 750)
                _.isFunction(self.temp.seekToOnce) && self.temp.seekToOnce()
            } else if (state == 0) {
                console.log('YT NEXT')
            } else if (!_.isUndefined(state)) {
                clearInterval(self.temp.playProgressInterval)
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
            clearTimeout(self.temp.errorTimeout)
            self.temp.errorTimeout = setTimeout(function () {
                self.temp.errorTimeout = null
                _.isFunction(callback) && callback.call(scope, error)
                console.log('ERROR NEXT')
            }, 2000)
        },
        onStopVideo:function () {
            youtube.stopVideo()
        },
        onLoadVideo:function (videoId, playerState) {
            var self = this.scope
            self.temp.debouncePlayProgress = _.debounce(function () {
                self.temp.isPausedDebounceObject && self.temp.isPausedDebounceObject.state && self.playerState(self.temp.isPausedDebounceObject.state)
                self.temp.isPausedDebounceObject && self.temp.isPausedDebounceObject.start && self.currentTime(self.temp.isPausedDebounceObject.start)
            }, 1100)
            self.showPlayer()
            if (pti.blockPlayback()) {
                youtube.stopVideo()
            } else {
                self.temp.seekToOnce = null
                if (playerState) {
                    self.temp.seekToOnce = _.once(function () {
                        if (playerState.state == 2) {
                            clearInterval(self.temp.playProgressInterval) //for cursor in playerWidget
                            youtube.pauseVideo()
                            self.currentTime(playerState.start)
                            self.temp.isPausedDebounceObject = { start:playerState.start, state:playerState.state}
                            //TODO 2013-09-11 create function for duplicate seekToOnce definition
                            self.temp.seekToOnce = _.once(function () {
                                youtube.seekTo(playerState.start)
                            })
                        } else {
                            youtube.seekTo(playerState.start)
                        }
                    })
                }
                youtube.loadVideoById(videoId)
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
        onSeekTo:function (seekTo) {
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
})
