siteHandlers = [new YoutubeHandler(), new SoundCloudHandler(), new VimeoHandler()]

siteHandlerManager = new SiteHandlerManager();

function SiteHandlerManager() {
    var currentPlayingHandler
    var blockPlayback = false
    SiteHandlerManager.prototype.mapping = new Object();
    SiteHandlerManager.prototype.errorTimeout

    SiteHandlerManager.prototype.getCurrentPlayingHandler = function () {
        return currentPlayingHandler
    }

    SiteHandlerManager.prototype.setVideoFeed = function (videoFeed) {
        $.jStorage.set(videoFeed.id, videoFeed)
    }

    SiteHandlerManager.prototype.getHandler = function (type) {
        var handler = SiteHandlerManager.prototype.mapping[type]
        if (handler) {
            return handler
        } else {
            throw 'Missing site handler for type: ' + type
        }
    }

    SiteHandlerManager.prototype.loadVideoFeed = function (linkContext) {
        if (linkContext.videoFeed && linkContext.videoFeed.template) {
            var value = linkContext.videoFeed
        } else {
            var value = $.jStorage.get(linkContext.videoFeed.id)
            //console.log(JSON.stringify(value) + 'FROM CACHE')
        }
//      console.log(value)
        if (value) {
            linkContext.fromCache = true;
            linkContext.videoFeed = value;
            SiteHandlerManager.prototype.fillVideoElement(linkContext);
        } else {
            linkContext.videoFeed.template = "rawTemplate"
            SiteHandlerManager.prototype.fillVideoElement(linkContext);
            SiteHandlerManager.prototype.getHandler(linkContext.videoFeed.type).loadVideoFeed(linkContext);
        }
    }

    SiteHandlerManager.prototype.playVideoFeed = function (videoFeed, playerState) {
        if (chrome.extension) {
            pti[videoFeed.type].loadVideo(videoFeed.id, playerState)
        } else {
            clearTimeout(SiteHandlerManager.prototype.errorTimeout)
            var siteHandler = SiteHandlerManager.prototype.getHandler(videoFeed.type)
            SiteHandlerManager.prototype.showPlayer(siteHandler.playerContainer)
            siteHandler.playVideoFeed(videoFeed, playerState)
            currentPlayingHandler = siteHandler
        }
    }

    SiteHandlerManager.prototype.hide = function (siteHandler) {
        var playerContainer = $('#' + siteHandler.playerContainer);
        playerContainer.width('0%')
        playerContainer.height('0%')
    }

    SiteHandlerManager.prototype.show = function (siteHandler) {
        var playerContainer = $('#' + siteHandler.playerContainer);
        playerContainer.width('100%')
        playerContainer.height('100%')
    }

    SiteHandlerManager.prototype.showPlayer = function (id) {
        id = id.replace(/^#?(.*)/, '#$1')
        id = $(id).attr('id')
        $.each(siteHandlers, function (index, item) {
            typeof this.clearTimeout == 'function' && this.clearTimeout()
            if (this.playerContainer && this.playerContainer == id) {
                SiteHandlerManager.prototype.show(this)
            } else {
                this.stop()
                SiteHandlerManager.prototype.hide(this)
            }
        })
    }

    SiteHandlerManager.prototype.stateChange = function (state) {
        if (state == "NEXT") {
            playlist.playNextVideo()
        } else if (state == "ERROR") {
            SiteHandlerManager.prototype.errorTimeout = setTimeout(function () {
                playlist.playNextVideo()
            }, 2000)
        }
    }

    SiteHandlerManager.prototype.fillVideoElement = function (linkContext) {
        var videoFeed = linkContext.videoFeed;
        var videoElement = linkContext.videoElement;
        var handler = SiteHandlerManager.prototype.getHandler(videoFeed.type);
        if (videoFeed) {
            videoElement.div.html(handler[videoFeed.template](videoFeed))
            videoElement.div.data('videoFeed', videoFeed)
            //todo workaround start
            if (videoFeed.template == "completeTemplate" || linkContext.fromCache) {
                typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                //todo workaroung end
            }
            if (!linkContext.fromCache && linkContext.videoFeed.template == "completeTemplate") {
                SiteHandlerManager.prototype.setVideoFeed(videoFeed)
            }
        }
    }

    SiteHandlerManager.prototype.getPlayerState = function () {
        var selectedVideo = playlist.getSelectedVideoDiv();
        var selectedVideoFeed = $(selectedVideo).data('videoFeed')
        var handler = SiteHandlerManager.prototype.getHandler(selectedVideoFeed.type);
        if (selectedVideoFeed) {
            var playerState = handler.getPlayerState();
            return playerState
        }
    }

    SiteHandlerManager.prototype.blockPlayback = function (flag) {
        if (flag != null) {
            blockPlayback = flag
            if (flag) {
                SiteHandlerManager.prototype.stopAll()
            }
            return blockPlayback
        } else {
            return blockPlayback
        }
    }

    SiteHandlerManager.prototype.stopAll = function () {
        $.each(siteHandlers, function (index, item) {
            var siteHandler = SiteHandlerManager.prototype.mapping[item.prefix];
            if (typeof siteHandler.stop == "function") {
                siteHandler.stop()
            }
        })
    }

    $.each(siteHandlers, function (index, item) {
        SiteHandlerManager.prototype.mapping[item.prefix] = item
    })
}

function YoutubeHandler() {
    window.onYouTubeIframeAPIReady = function () {
        window.youtube = new YT.Player('youtube', {
            height:'100%',
            width:'100%',
            videoId:'MK6TXMsvgQg',
            events:{
                'onReady':onPlayerReady,
                'onStateChange':change,
                'onError':onError
            }
        });
    }
    function onPlayerReady(event) {
        console.log('playFirstLoaded yt')
        playFirstLoaded();
    }

    function change(state) {
//        console.log(state)
        if (state.data == 1 && SiteHandlerManager.prototype.blockPlayback()) {
            YoutubeHandler.prototype.stop()
            console.log('blocked yt playback')
            seekToOnce = null
        }
        if (state.data == 1) {
            typeof seekToOnce == "function" && seekToOnce()
            if (YoutubeHandler.prototype.errorTimeout) {
                clearTimeout(YoutubeHandler.prototype.errorTimeout)
                console.log('no error')
            }
        }
        if (state.data == 0) {
            SiteHandlerManager.prototype.stateChange("NEXT")
        }
    }

    function onError(error) {
        console.log(error)
        clearTimeout(YoutubeHandler.prototype.errorTimeout)
        YoutubeHandler.prototype.errorTimeout = setTimeout(function () {
            SiteHandlerManager.prototype.stateChange("ERROR")
        }, 2000)
    }

    YoutubeHandler.prototype.errorTimeout
    YoutubeHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://cdn.ndtv.com/tech/images/youtube_logo_120.jpg"><div class="pti-logo"></div><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
    YoutubeHandler.prototype.completeTemplate = _.template('<div><div class="image-div"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-logo"></div></div><span class="videoText"><b><%= title %></b><br>by <%= uploader %></span></div>')
    YoutubeHandler.prototype.errorTemplate = _.template('<div><div class="image-div"><img src="http://s.ytimg.com/yts/img/meh7-vflGevej7.png"><div class="pti-logo"></div></div><span class="error-text"><b><a href="http://www.youtube.com/watch?v=<%=id%>" target="_blank"><%=error%></a></b></span></div>');
    YoutubeHandler.prototype.prefix = "y"
    //TODO https://www.youtube.com/embed/?listType=playlist&amp;list=PLhBgTdAWkxeBX09BokINT1ICC5IZ4C0ju&amp;showinfo=1
    YoutubeHandler.prototype.regex = /(youtu.be(\\?\/|\u00252F)|watch[^ \'\'<>]+v=|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/)([^?\s&\'\'<>\/\\.,#]{11})/
    YoutubeHandler.prototype.regexGroup = 4
    YoutubeHandler.prototype.playerContainer = 'youtubeContainer'
    YoutubeHandler.prototype.playTimeout
    var seekToOnce
    YoutubeHandler.prototype.loadVideoFeed = function (linkContext) {
        $.ajax({
            url:"http://gdata.youtube.com/feeds/api/videos/" + linkContext.videoFeed.id + "?v=2&alt=jsonc",
            success:function (data) {
                try {
                    data.data.type = "y"
                    var videoFeed = new VideoFeed(data.data)
                    videoFeed.template = "completeTemplate"
                    linkContext.videoFeed = videoFeed
                    SiteHandlerManager.prototype.fillVideoElement(linkContext)
                } finally {

                }
            },
            error:function (data) {
//                console.log(data.responseText)
                try {
                    linkContext.videoFeed.error = $.parseJSON(data.responseText).error.message
                } catch (e) {
                    linkContext.videoFeed.error = data.responseText.replace(/.*<code>(\w+)<\/code>.*/, "$1")
                }
                linkContext.videoFeed.template = "errorTemplate"
                SiteHandlerManager.prototype.fillVideoElement(linkContext)
                if (data.responseText.match(/too_many_recent_calls/)) {
                    setTimeout(function () {
                        console.log("retrying video")
                        if ($(linkContext.videoElement.div).parent().length > 0) {
                            YoutubeHandler.prototype.loadVideoFeed(linkContext)
                        } else {
                            console.log('playlist was emptied, wont continue loading info for this video')
                        }
                    }, 35000)
                } else {
                    typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                }
            },
            context:linkContext,
            dataType:'json'
        })
    }

    YoutubeHandler.prototype.playVideoFeed = function (videoFeed, playerState) {
        if (SiteHandlerManager.prototype.blockPlayback()) {
            YoutubeHandler.prototype.stop()
            console.log('blocked yt playback in playVideoFeed')
        } else {
            var videoId = videoFeed.id
            seekToOnce = null
            if (playerState) {
                seekToOnce = _.once(function () {
                    youtube.seekTo(playerState.start)
                })
                youtube.loadVideoById(videoId)
            } else {
                youtube.loadVideoById(videoId)
            }
        }
    }.bind(this)
    YoutubeHandler.prototype.stop = function () {
        youtube.stopVideo()
    }

    YoutubeHandler.prototype.clearTimeout = function () {
        clearTimeout(YoutubeHandler.prototype.playTimeout)
    }

    YoutubeHandler.prototype.getPlayerState = function () {
        var currentTime = youtube.getCurrentTime();
        var playerState = youtube.getPlayerState();
        return { start:currentTime, state:playerState }
    }
}

function SoundCloudHandler() {
    var currentTime
    var currentSoundIndex
    var state
    var seekToOnce
    var playProgressThrottle
    SoundCloudHandler.prototype.initializePlayer = function () {
        $('#soundCloud').append(SoundCloudHandler.prototype.playerTemplate())
        var scWidgetIframe = document.getElementById('sc-widget');
        window.scWidget = SC.Widget(scWidgetIframe);

        scWidget.bind(SC.Widget.Events.READY, function () {
            console.log('playFirstLoaded sc')
            playFirstLoaded();
            scWidget.bind(SC.Widget.Events.FINISH, function () {
                scWidget.getCurrentSoundIndex(function (data) {
                    scWidget.getSounds(function (sounds) {
                        console.log('finished sounds count: ' + sounds.length + ' and current index: ' + data)
                        if (data == sounds.length - 1) {
                            SiteHandlerManager.prototype.stateChange("NEXT")
                        }
                    })
                })
            });
            playProgressThrottle = _.throttle(function (position) {
                currentTime = position
                scWidget.isPaused(function (paused) {
                    paused ? state = 2 : state = 1;
                })
                scWidget.getCurrentSoundIndex(function (index) {
                    currentSoundIndex = index
                })
                if (SoundCloudHandler.prototype.properties.dontPlay || SiteHandlerManager.prototype.blockPlayback()) {
                    SoundCloudHandler.prototype.stop()
                    console.log('blocked sc playback in play_progress')
                } else {
                    if (position > 0) {
//                        console.log(position)
                        if (typeof seekToOnce == "function") {
                            seekToOnce()
                        }
                    }
                }
            }, 200)
            scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
                scWidget.getPosition(playProgressThrottle)
            })
        })
    }
    SoundCloudHandler.prototype.properties = { errorTimeout:null, dontPlay:true }
    SoundCloudHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://photos4.meetupstatic.com/photos/sponsor/9/5/4/4/iab120x90_458212.jpeg"><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
    SoundCloudHandler.prototype.playerUrl = chrome.extension ? "https://w.soundcloud.com/player/?url=https://soundcloud.com/timelock/timelock-ace-ventura-inside-us&origin=chrome-extension%3A%2F%2Fhnelbfkfkaieecemgnpkpnopdpmffkii" : "https://w.soundcloud.com/player/?url=https://soundcloud.com/timelock/timelock-ace-ventura-inside-us"
    SoundCloudHandler.prototype.playerTemplate = _.template('<iframe id="sc-widget" src="' + SoundCloudHandler.prototype.playerUrl + '" width="100%" height="465" scrolling="no" frameborder="no"> </iframe>')

    SoundCloudHandler.prototype.prefix = "s"
    //%3F
    SoundCloudHandler.prototype.regex = /((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^\s,?"=&#<]+)/
    SoundCloudHandler.prototype.regexGroup = 5
    SoundCloudHandler.prototype.playerContainer = 'soundCloudContainer'
    SoundCloudHandler.prototype.clearTimeout = function () {
        clearTimeout(SoundCloudHandler.prototype.properties.errorTimeout)
    }
    SoundCloudHandler.prototype.loadVideoFeed = function (linksContext) {
        typeof linksContext.loadVideoFeedCallback == "function" && linksContext.loadVideoFeedCallback();
    }
    SoundCloudHandler.prototype.getPlayerState = function () {
        return { start:currentTime, state:state, index:currentSoundIndex}
    }

    SoundCloudHandler.prototype.playVideoFeed = function (videoFeed, playerState) {
//        console.log(videoFeed)
//        console.log(playerState)
        SoundCloudHandler.prototype.properties.dontPlay = false
        var playerUrl = 'https://w.soundcloud.com/player/?url='
        var id = videoFeed.id.replace(/^\/?(.*)/, '/$1').replace(/\\/g, '')
        var url = playerUrl + id
//        console.log(url)
        clearTimeout(SoundCloudHandler.prototype.properties.errorTimeout)
        SoundCloudHandler.prototype.properties.errorTimeout = setTimeout(function () {
            SiteHandlerManager.prototype.stateChange("ERROR")
        }, 5000)
        scWidget.load(url, {callback:function () {
            clearTimeout(SoundCloudHandler.prototype.properties.errorTimeout)
            if (SoundCloudHandler.prototype.properties.dontPlay && SiteHandlerManager.prototype.blockPlayback()) {
                SoundCloudHandler.prototype.stop()
                console.log('blocked sc playback in load callback')
            } else {
                seekToOnce = null
                if (playerState) {
                    seekToOnce = _.once(function () {
                        scWidget.seekTo(playerState.start)
                    })
                }
                if (playerState && playerState.index) {
                    scWidget.skip(playerState.index)
                } else {
                    scWidget.skip(0) //without this sometimes sc's player play_progress won't start start publishing events
                }
            }
        }})
    }
    SoundCloudHandler.prototype.stop = function () {
        SoundCloudHandler.prototype.properties.dontPlay = true
        scWidget.pause()
    }
}

function VimeoHandler() {
    VimeoHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://www.siliconrepublic.com/fs/img/news/201208/rs-120x90/vimeo.jpg"><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
    VimeoHandler.prototype.completeTemplate = _.template('<div><div class="image-div"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-logo"></div></div><span class="videoText"><b><%= title %></b><br>by <%= uploader %></span></div>')
    VimeoHandler.prototype.playerUrl = chrome.extension ? "http://player.vimeo.com/video/<%= id %>?api=1&player_id=vimeo&origin=chrome-extension%3A%2F%2Fhnelbfkfkaieecemgnpkpnopdpmffkii" : "http://player.vimeo.com/video/<%= id %>?api=1&player_id=vimeo"
    VimeoHandler.prototype.playerTemplate = _.template('<iframe id="vimeo" src="' + VimeoHandler.prototype.playerUrl + '" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>')
    VimeoHandler.prototype.prefix = 'v'
    VimeoHandler.prototype.regex = /vimeo.com\\?\/(\d+)/
    VimeoHandler.prototype.regexGroup = 1
    VimeoHandler.prototype.playerContainer = 'vimeoContainer'
    VimeoHandler.prototype.playInterval
    VimeoHandler.prototype.playTimeout
    var lastPlayProgress
    var stuckPlayProgressCounter = 0
    var stuckPlayProgress = function () {
        if (lastPlayProgress == currentTime) {
            if (++stuckPlayProgressCounter >= 5) {
                vimeo.api('seekTo', Math.ceil(currentTime))
                console.log('stuckPlayProgress kicked in')
                stuckPlayProgressCounter = 0
            }
        }
        lastPlayProgress = currentTime
    }
    VimeoHandler.prototype.playProgressThrottle = _.throttle(function (playProgress) {
        if (SiteHandlerManager.prototype.blockPlayback()) {
            VimeoHandler.prototype.stop()
            console.log('blocked vimeo playback')
        }
//        console.log(playProgress)
        currentTime = playProgress.seconds
        stuckPlayProgress()
    }, 500)
    var currentTime
    var state
    VimeoHandler.prototype.getPlayerState = function () {
        return {start:currentTime, state:state}
    }
    VimeoHandler.prototype.clearTimeout = function () {
        clearInterval(VimeoHandler.prototype.playInterval)
        clearTimeout(VimeoHandler.prototype.playTimeout)
    }
    VimeoHandler.prototype.loadVideoFeed = function (linkContext) {
        $.ajax({
            url:'https://vimeo.com/api/v2/video/' + linkContext.videoFeed.id + '.json',
            success:function (data) {
//                console.log(JSON.stringify(data[0]))
                data[0].type = VimeoHandler.prototype.prefix
                linkContext.videoFeed = new VideoFeed(data[0])
                linkContext.videoFeed.template = "completeTemplate"
                SiteHandlerManager.prototype.fillVideoElement(linkContext)
            },
            error:function (error) {
                typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                console.log('error in vimeoHandler loadVideoFeed start')
                console.log(error)
                console.log('error in vimeoHandler loadVideoFeed end')
            },
            dataType:'jsonp',
            timeout:10000
        })
    }
    VimeoHandler.prototype.playVideoFeed = function (videoFeed, playerState) {
        $('#' + VimeoHandler.prototype.playerContainer).empty().append(VimeoHandler.prototype.playerTemplate(videoFeed))
        window.vimeo = $f($('#vimeo')[0])
        VimeoHandler.prototype.playTimeout = setTimeout(function () {
            clearInterval(VimeoHandler.prototype.playInterval)
            SiteHandlerManager.prototype.stateChange("ERROR")
        }, 5000)
        vimeo.addEvent('ready', function (id) {
            clearInterval(VimeoHandler.prototype.playInterval)
            vimeo.addEvent('play', function () {
                console.log('playing')
                state = 1
                clearInterval(VimeoHandler.prototype.playInterval)
                clearTimeout(VimeoHandler.prototype.playTimeout)
                vimeo.removeEvent('play')
                if (playerState) {
                    vimeo.api('seekTo', playerState.start)
                }
                vimeo.addEvent('play', function () {
                    state = 1
                })
                vimeo.addEvent('pause', function () {
                    state = 2
                })
                vimeo.addEvent('playProgress', VimeoHandler.prototype.playProgressThrottle.bind(this))
                vimeo.addEvent('finish', function () {
                    console.log('finish')
                    state = 0
                    SiteHandlerManager.prototype.stateChange("NEXT")
                })
            })
            VimeoHandler.prototype.playInterval = setInterval(function () {
                vimeo.api('play')
//                console.log('interval')
            }, 100)
//            console.log('ready')
        })
    }
    VimeoHandler.prototype.stop = function () {
        currentTime = null
        $('#' + VimeoHandler.prototype.playerContainer).empty()
//        console.log('empty')
    }
}