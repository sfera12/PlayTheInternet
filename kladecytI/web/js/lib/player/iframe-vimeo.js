define(["pti", "vimeo-api", "jquery", "underscore", "ctemplates"], function (pti, vimeoapi, $, _) {
    new pti.Player("v", {
        playerTemplate:PTITemplates.prototype.VimeoPlayerTemplate,
        onPlayerReady:function (playerapiid) {
        },
        onPlayerState:function (state) {
        },
        onError:function (error) {
        },
        onStopVideo:function () {
            $('#vimeoContainer').empty()
        },
        onLoadVideo:function (videoId, playerState) {
            pti.v.showPlayer()
            var self = this.scope
            var playProgressThrottle = _.throttle(function (playProgress) {
                if (pti.blockPlayback()) {
                    self.stopVideo()
                    console.log('blocked vimeo playback')
                }
//        console.log(playProgress)
                self.currentTime(playProgress.seconds)
//            stuckPlayProgress()
            }, 500)
            $('#vimeoContainer').empty().append(self.options.playerTemplate({id:videoId}))
            window.vimeo = $f($('#vimeo')[0])
            self.temp.playTimeout = setTimeout(function () {
                clearInterval(self.temp.playInterval)
                console.log("PLAY TIMEOUT ERROR")
            }, 5000)
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
        }
    }, 'vimeoContainer')
})
