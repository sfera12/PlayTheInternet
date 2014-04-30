define(["player/iframe-player", "vimeo-api", "jquery", "underscore", "ctemplates"], function (pti, vimeoapi, c, d) {
    new pti.Player("v", {
        playerTemplate:PTITemplates.prototype.VimeoPlayerTemplate,
        onPlayerReady:function (playerapiid) {
        },
        onPlayerState:function (state) {
        },
        onError:function (error) {
        },
        onStopVideo:function () {
            var self = this.scope
            $('#vimeoContainer').empty()
            clearTimeout(self.temp.playTimeout)
        },
        onLoadVideo:function (videoId) {
            pti.v.showPlayer()
            var self = this.scope
            var playProgressThrottle = _.throttle(function (playProgress) {
                if (pti.blockPlayback()) {
                    self.stopVideo()
                    console.log('blocked vimeo playback')
                }
//        console.log(playProgress)
                self.currentTime(playProgress.seconds)
                vimeo.api('paused', function(status) {
//                    console.log(status)
                    if(status != true) {
//                        console.log(1)
                        self.playerState(1)
                    } else {
//                        console.log(2)
                        self.playerState(2)
                    }
                })
//            stuckPlayProgress()
            }, 500)
            $('#vimeoContainer').empty().append(self.options.playerTemplate({id:videoId}))
            window.vimeo = $f($('#vimeo')[0])
            self.temp.playTimeout = setTimeout(function () {
                clearInterval(self.temp.playInterval)
                console.log("PLAY TIMEOUT ERROR")
                self.error('PLAY TIMEOUT ERROR')
            }, 15000)
            vimeo.addEvent('ready', function (id) {
                clearInterval(self.temp.playInterval)
                vimeo.addEvent('play', function () {
                    console.log('playing')
                    self.playerState(1)
                    clearInterval(self.temp.playInterval)
                    clearTimeout(self.temp.playTimeout)
                    vimeo.removeEvent('play')
                    vimeo.api('getDuration', function (duration) {
                        self.duration(duration)
                    })
                    if (playerState) {
                        if (playerState.state == 2) {
                            vimeo.api('pause')
                            self.currentTime(playerState.start)
                            self.playerState(playerState.state)
                        }
                        vimeo.api('seekTo', playerState.start)
                    }
                    vimeo.addEvent('play', function () {
                        self.playerState(1)
                    })
                    vimeo.addEvent('pause', function () {
                        self.playerState(2)
                    })
                    vimeo.addEvent('playProgress', playProgressThrottle)
                    vimeo.addEvent('finish', function () {
                        console.log('finish')
                        self.playerState(0)
                        console.log("VIMEO NEXT")
                    })
                })
                self.temp.playInterval = setInterval(function () {
                    vimeo.api('play')
//                console.log('interval')
                }, 100)
//            console.log('ready')
            })
        },
        onCurrentTime:function (time) {
        },
        onInitializePlayer:function () {
        },
        onClearTimeout:function () {
            var self = this.scope
            clearInterval(self.temp.playInterval)
            clearTimeout(self.temp.playTimeout)
        },
        onPlayVideo:function () {
            vimeo.api('play')
        },
        onPauseVideo:function () {
            vimeo.api('pause')
        },
        onSeekTo:function (seekTo) {
            vimeo.api('seekTo', seekTo)
        },
        onVolume:function(volume) {
            try {
                vimeo.api('setVolume', volume / 100) //throws TypeError: Cannot read property 'postMessage' of null when window.vimeo object exists without video loaded on page
            } catch (e) {
            }
        }
    }, 'vimeoContainer')
})
