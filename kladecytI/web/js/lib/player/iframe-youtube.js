define(["pti", "jquery", "underscore"], function (pti, b, c) {
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
                console.log('block YT Payback in onPlayerState')
                self.stopVideo()
            } else if (state == 1) {
                self.duration(youtube.getDuration() + 1)
                if (self.temp.errorTimeout) {
                    clearTimeout(self.temp.errorTimeout) & (self.temp.errorTimeout = null)
                    console.log('no error')
                }
                clearInterval(self.temp.playProgressInterval)
                self.temp.playProgressInterval = setInterval(function () {
                    if(pti.blockPlayback()) {
                        console.log('block YT Payback in playProgress')
                        self.stopVideo()
                    }
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
            }, 15000)
        },
        onStopVideo:function () {
            var self = this.scope
            self.clearTimeout()
            youtube.stopVideo()
        },
        onLoadVideo:function (videoId, playerState) {
            var self = this.scope
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
                self.error({data:'manual'})
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
        },
        onClearTimeout:function () {
            var self = this.scope
            clearTimeout(self.temp.errorTimeout)
            clearInterval(self.temp.playProgressInterval)
        },
        onVolume:function(volume) {
            youtube.setVolume(volume)
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
