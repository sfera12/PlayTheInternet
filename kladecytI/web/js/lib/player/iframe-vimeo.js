define(["player/iframe-player", "vimeo-api", "jquery", "underscore", "ctemplates"], function (pti, vimeoapi, c, d) {
    new pti.Player("v", {
        playerTemplate:PTITemplates.prototype.VimeoPlayerTemplate,
//        onPlayerReady:function (playerapiid) {
//        },
//        onPlayerState:function (state) {
//        },
//        onError:function (error) {
//        },
        onStopVideo:function () {
            var self = this.scope
            $('#vimeoContainer').empty()
            self.clearTimeout()
        },
        onLoadVideo:function (videoId) {
            var self = this.scope
            $('#vimeoContainer').empty().append(self.options.playerTemplate({id:videoId}))
            window.vimeo = $f($('#vimeo')[0])
            vimeo.addEvent('ready', function (id) {
                clearInterval(self.temp.playProgressInterval) //because vimeo calls ready twice
                self.temp.playProgressInterval = setInterval(self.temp.playProgress, 200)
                vimeo.addEvent('play', function () {
                    pti.nativeRequestPlaying = true
                })
                vimeo.addEvent('pause', function () {
                    pti.nativeRequestStop = true
                })
                vimeo.addEvent('finish', function () {
                    console.log('finish')
                    self.playerState(0)
                    console.log("VIMEO NEXT")
                })
            })
        },
//        onCurrentTime:function (time) {
//        },
        onInitializePlayer:function () {
            var self = this.scope
            self.playProgressCallbacks = $.Callbacks()
            self.temp.playProgress = function() {
                var pausedDef = new $.Deferred(), timeDef = new $.Deferred(), durationDef = new $.Deferred()
                vimeo.api('paused', function (isPaused) {
                    pausedDef.resolve(isPaused ? 2 : 1)
                })
                vimeo.api('getCurrentTime', function (position) {
                    timeDef.resolve(position)
                })
                vimeo.api('getDuration', function (duration) {
                    durationDef.resolve(duration)
                })
                $.when(pausedDef, timeDef, durationDef).then(self.playProgressCallbacks.fire)
            }
        },
        onClearTimeout:function () {
            var self = this.scope
            clearInterval(self.temp.playProgressInterval)
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
    pti.v.initializePlayer()
})
