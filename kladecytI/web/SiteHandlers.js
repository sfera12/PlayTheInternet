siteHandlers = [new YoutubeHandler(), new SoundCloudHandler(), new VimeoHandler()]

siteHandlerManager = new SiteHandlerManager();

function SiteHandlerManager() {
    SiteHandlerManager.prototype.mapping = new Object();
    SiteHandlerManager.prototype.errorTimeout

    SiteHandlerManager.prototype.setVideoFeed = function (videoFeed) {
        $.jStorage.set(videoFeed.id, videoFeed)
    }

    SiteHandlerManager.prototype.getHandler = function(type) {
        var handler = SiteHandlerManager.prototype.mapping[type]
        if (handler) {
            return handler
        } else {
            throw 'Missing site handler for type: ' + type
        }
    }

    SiteHandlerManager.prototype.loadVideoFeed = function (linkContext) {
        if(linkContext.videoFeed && linkContext.videoFeed.template) {
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

    SiteHandlerManager.prototype.playVideoFeed = function(videoFeed) {
        clearTimeout(SiteHandlerManager.prototype.errorTimeout)
        var siteHandler = SiteHandlerManager.prototype.getHandler(videoFeed.type)
        SiteHandlerManager.prototype.showPlayer(siteHandler.playerContainer)
        siteHandler.playVideoFeed(videoFeed)
    }

    SiteHandlerManager.prototype.hide = function(siteHandler) {
        var playerContainer = $('#' + siteHandler.playerContainer);
        playerContainer.width('0%')
        playerContainer.height('0%')
    }

    SiteHandlerManager.prototype.show = function(siteHandler) {
        var playerContainer = $('#' + siteHandler.playerContainer);
        playerContainer.width('100%')
        playerContainer.height('100%')
    }

    SiteHandlerManager.prototype.showPlayer = function(id) {
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

    SiteHandlerManager.prototype.stateChange = function(state) {
        if(state == "NEXT") {
            playlist.playNextVideo()
        } else if (state == "ERROR") {
            SiteHandlerManager.prototype.errorTimeout = setTimeout(function () {
                playlist.playNextVideo()
            }, 2000)
        }
    }

    SiteHandlerManager.prototype.fillVideoElement = function(linkContext) {
        var videoFeed = linkContext.videoFeed;
        var videoElement = linkContext.videoElement;
        var handler = SiteHandlerManager.prototype.getHandler(videoFeed.type);
        if(videoFeed) {
            videoElement.div.html(handler[videoFeed.template](videoFeed))
            videoElement.div.data('videoFeed', videoFeed)
            //todo workaround start
            if(videoFeed.template == "completeTemplate" || linkContext.fromCache) {
                typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                //todo workaroung end
            }
            if (!linkContext.fromCache && linkContext.videoFeed.template == "completeTemplate") {
                SiteHandlerManager.prototype.setVideoFeed(videoFeed)
            }
        }
    }

    $.each(siteHandlers, function (index, item) {
        SiteHandlerManager.prototype.mapping[item.prefix] = item
    })
}

function YoutubeHandler() {
    YoutubeHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://cdn.ndtv.com/tech/images/youtube_logo_120.jpg"><div class="pti-logo"></div><div class="pti-logo"></div></div><span><b><%= id %></b></span></div>')
    YoutubeHandler.prototype.completeTemplate = _.template('<div><div class="image-div"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-logo"></div></div><span><b><%= title %></b><br>by <%= uploader %></span></div>')
    YoutubeHandler.prototype.errorTemplate = _.template('<div><div class="image-div"><img src="http://s.ytimg.com/yts/img/meh7-vflGevej7.png"><div class="pti-logo"></div></div><span class="error-text"><b><a href="http://www.youtube.com/watch?v=<%=id%>" target="_blank"><%=error%></a></b></span></div>');
    YoutubeHandler.prototype.prefix = "y"
    YoutubeHandler.prototype.regex = /(youtu.be(\\?\/|\u00252F)|watch[^ \'\'<>]+v=|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/)([^\s&\'\'<>\/\\.,#]{11})/
    YoutubeHandler.prototype.regexGroup = 4
    YoutubeHandler.prototype.playerContainer = 'youtubeContainer'
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
                        YoutubeHandler.prototype.loadVideoFeed(linkContext)
                    }, 35000)
                } else {
                    typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                }
            },
            context:linkContext,
            dataType:'json'
        })
    }

    YoutubeHandler.prototype.playVideoFeed = function (videoFeed) {
        var videoId = videoFeed.id
        youtube.loadVideoById(videoId)
    }
    YoutubeHandler.prototype.stop = function() {
        youtube.stopVideo()
    }
}

function SoundCloudHandler() {
    SoundCloudHandler.prototype.properties = { errorTimeout: null, dontPlay: true }
    SoundCloudHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://photos4.meetupstatic.com/photos/sponsor/9/5/4/4/iab120x90_458212.jpeg"><div class="pti-logo"></div></div><span><b><%= id %></b></span></div>')
    SoundCloudHandler.prototype.prefix = "s"
    SoundCloudHandler.prototype.regex = /((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^\s,?"=&#<]+)/
    SoundCloudHandler.prototype.regexGroup = 5
    SoundCloudHandler.prototype.playerContainer = 'soundCloudContainer'
    SoundCloudHandler.prototype.clearTimeout = function() {
        clearTimeout(SoundCloudHandler.prototype.properties.errorTimeout)
    }
    SoundCloudHandler.prototype.loadVideoFeed = function (linksContext) {
        typeof linksContext.loadVideoFeedCallback == "function" && linksContext.loadVideoFeedCallback();
    }
    SoundCloudHandler.prototype.playVideoFeed = function(videoFeed) {
        SoundCloudHandler.prototype.properties.dontPlay = false
        var playerUrl = 'https://w.soundcloud.com/player/?url='
        var id = videoFeed.id.replace(/^\/?(.*)/, '/$1').replace(/\\/g, '')
        var url = playerUrl + id
//        console.log(url)
        clearTimeout(SoundCloudHandler.prototype.properties.errorTimeout)
        SoundCloudHandler.prototype.properties.errorTimeout = setTimeout(function() {
            SiteHandlerManager.prototype.stateChange("ERROR")
        }, 5000)
        scWidget.load(url, {callback: function() {
            clearTimeout(SoundCloudHandler.prototype.properties.errorTimeout)
            if(!SoundCloudHandler.prototype.properties.dontPlay) {
                scWidget.play()
            }
        }})
    }
    SoundCloudHandler.prototype.stop = function() {
        SoundCloudHandler.prototype.properties.dontPlay = true
        scWidget.pause()
    }
}

function VimeoHandler() {
    VimeoHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://www.siliconrepublic.com/fs/img/news/201208/rs-120x90/vimeo.jpg"><div class="pti-logo"></div></div><span><b><%= id %></b></span></div>')
    VimeoHandler.prototype.completeTemplate = _.template('<div><div class="image-div"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-logo"></div></div><span><b><%= title %></b><br>by <%= uploader %></span></div>')
    VimeoHandler.prototype.playerTemplate = _.template('<iframe id="vimeo" src="http://player.vimeo.com/video/<%= id %>?api=1&player_id=vimeo" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>')
    VimeoHandler.prototype.prefix = 'v'
    VimeoHandler.prototype.regex = /vimeo.com\\?\/(\d+)/
    VimeoHandler.prototype.regexGroup = 1
    VimeoHandler.prototype.playerContainer = 'vimeoContainer'
    VimeoHandler.prototype.playInterval
    VimeoHandler.prototype.playTimeout
    VimeoHandler.prototype.clearTimeout = function() {
        clearInterval(VimeoHandler.prototype.playInterval)
        clearTimeout(VimeoHandler.prototype.playTimeout)
    }
    VimeoHandler.prototype.loadVideoFeed = function(linkContext) {
        $.ajax({
            url: 'http://vimeo.com/api/v2/video/' + linkContext.videoFeed.id + '.json',
            success: function(data) {
//                console.log(JSON.stringify(data[0]))
                data[0].type = VimeoHandler.prototype.prefix
                linkContext.videoFeed = new VideoFeed(data[0])
                linkContext.videoFeed.template = "completeTemplate"
                SiteHandlerManager.prototype.fillVideoElement(linkContext)
            },
            error: function(error) {
                typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                console.log('error in vimeoHandler loadVideoFeed start')
                console.log(error)
                console.log('error in vimeoHandler loadVideoFeed end')
            },
            dataType: 'jsonp',
            timeout: 10000
        })
    }
    VimeoHandler.prototype.playVideoFeed = function(videoFeed) {
        $('#' + VimeoHandler.prototype.playerContainer).empty().append(VimeoHandler.prototype.playerTemplate(videoFeed))
        var player = $f($('#vimeo')[0])
        VimeoHandler.prototype.playTimeout = setTimeout(function() {
            clearInterval(VimeoHandler.prototype.playInterval)
            SiteHandlerManager.prototype.stateChange("ERROR")
        }, 5000)
        player.addEvent('ready', function(id) {
            clearInterval(VimeoHandler.prototype.playInterval)
            player.addEvent('play', function () {
//                console.log('playing')
                clearInterval(VimeoHandler.prototype.playInterval)
                clearTimeout(VimeoHandler.prototype.playTimeout)
                player.addEvent('finish', function() {
//                    console.log('finish')
                    SiteHandlerManager.prototype.stateChange("NEXT")
                })
            })
            VimeoHandler.prototype.playInterval = setInterval(function () {
                player.api('play')
//                console.log('interval')
            }, 100)
//            console.log('ready')
        })
    }
    VimeoHandler.prototype.stop = function() {
        $('#' + VimeoHandler.prototype.playerContainer).empty()
//        console.log('empty')
    }
}