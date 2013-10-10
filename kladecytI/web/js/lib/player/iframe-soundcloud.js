define(["pti", "soundcloud-api", "jquery", "underscore"], function (pti, scapi, $, _) {
        new pti.Player("s", {
            playerTemplate:_.template('<iframe id="sc-widget" src="https://w.soundcloud.com/player/?url=https://soundcloud.com/timelock/timelock-ace-ventura-inside-us" width="100%" height="465" scrolling="no" frameborder="no"> </iframe>'),
            onPlayerReady:function (playerapiid) {
            },
            onPlayerState:function (state) {
            },
            onError:function (error) {
            },
            onStopVideo:function () {
                this.scope.temp.dontPlay = true
                scWidget.pause()
            },
            onLoadVideo:function (videoId, playerState) {
                pti.sc.showPlayer()
                //        console.log(videoFeed)
//        console.log(playerState)
                var self = this.scope
                self.temp.dontPlay = false
                var playerUrl = 'https://w.soundcloud.com/player/?url='
                var id = videoId.replace(/^\/?(.*)/, '/$1').replace(/\\/g, '')
                var url = playerUrl + id
//        console.log(url)
                clearTimeout(self.temp.errorTimeout)
                self.temp.errorTimeout = setTimeout(function () {
                    console.log("ERROR TIMEOUT")
                }, 5000)
                scWidget.load(url, {callback:function () {
                    clearTimeout(self.temp.errorTimeout)
                    if (self.temp.dontPlay && pti.blockPlayback()) {
                        self.stopVideo()
                        console.log('blocked sc playback in load callback')
                    } else {
                        self.temp.seekToOnce = null
                        if (playerState) {
                            if (playerState.state == 2) {
                                self.temp.seekToOnce = _.once(function () {
                                    scWidget.pause()
                                    self.temp.isPausedDebounceObject = { start:playerState.start * 1000, state:playerState.state }
                                    self.temp.seekToOnce = _.once(function () {
                                        //elegant solution
                                        scWidget.seekTo(playerState.start * 1000)
                                        scWidget.seekTo(playerState.start * 1000)
                                        scWidget.seekTo(playerState.start * 1000)
                                        scWidget.seekTo(playerState.start * 1000)
                                        scWidget.seekTo(playerState.start * 1000)
                                        //elegant solution end
                                    })
                                })
                            } else {
                                self.temp.seekToOnce = _.once(function () {
                                    scWidget.seekTo(playerState.start * 1000)
                                })
                            }
                        }
                        if (playerState && playerState.index) {
                            scWidget.skip(playerState.index)
                        } else {
                            scWidget.skip(0) //without this sometimes sc's player play_progress won't start start publishing events
                        }
                    }
                }})
            },
            onCurrentTime:function (time) {
            },
            onInitializePlayer:function () {
                var self = this.scope
                $('#soundCloud').append(self.options.playerTemplate())
                var scWidgetIframe = document.getElementById('sc-widget');
                window.scWidget = SC.Widget(scWidgetIframe);

                scWidget.bind(SC.Widget.Events.READY, function () {
                    self.playerReady(1)
                    console.log('playFirstLoaded sc')
//            playFirstLoaded();
                    scWidget.bind(SC.Widget.Events.FINISH, function () {
                        scWidget.getCurrentSoundIndex(function (data) {
                            scWidget.getSounds(function (sounds) {
                                console.log('finished sounds count: ' + sounds.length + ' and current index: ' + data)
                                if (data == sounds.length - 1) {
                                    console.log("SC NEXT")
                                    self.playerState(0)
                                }
                            })
                        })
                    });
                    self.temp.isPausedDebounce = _.debounce(function () {
                        self.temp.isPausedDebounceObject && self.temp.isPausedDebounceObject.state && self.playerState(self.temp.isPausedDebounceObject.state)
                        self.temp.isPausedDebounceObject && self.temp.isPausedDebounceObject.start && self.currentTime(self.temp.isPausedDebounceObject.start) && console.log(self.temp.isPausedDebounceObject.start)
                    }, 1100)
                    self.temp.playProgressThrottle = _.throttle(function (position) {
//                console.log(position)
                        self.currentTime(position)

                        scWidget.isPaused(function (paused) {
                            self.temp.isPausedDebounce()
                            paused ? self.playerState(2) : self.playerState(1);
                        })
                        //TODO 2013-09-06 maybe move getSoundIndex and duration to .FINISH event
                        scWidget.getCurrentSoundIndex(function (index) {
                            self.soundIndex(index)
                        })
                        scWidget.getDuration(function (duration) {
                            self.duration(duration)
                        })
                        if (self.temp.dontPlay || pti.blockPlayback()) {
                            self.stopVideo()
                            console.log('blocked sc playback in play_progress')
                        } else {
                            if (position > 0) {
//                        console.log(position)
                                _.isFunction(self.temp.seekToOnce) && self.temp.seekToOnce()
                            }
                        }
                    }, 500)
                    scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
                        scWidget.getPosition(self.temp.playProgressThrottle)
                    })
                })
            },
            onClearTimeout:function () {
                var self = this.scope
                clearTimeout(self.temp.errorTimeout)
            },
            onPlayVideo:function () {
                scWidget.play()
            },
            onPauseVideo:function () {
                scWidget.pause()
            },
            onSeekTo:function (seekTo) {
                scWidget.seekTo(seekTo * 1000)
            },
            onBeforeCurrentTime:function (inputs) {
                return inputs ? [inputs / 1000] : []
            },
            onBeforeDuration:function (inputs) {
                return inputs ? [inputs / 1000] : []
            }
        }, 'soundCloudContainer')
        pti.s.initializePlayer()
    }
)
