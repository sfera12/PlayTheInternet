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
        var value = $.jStorage.get(linkContext.videoItem.id)
//      console.log(value)
        if (value) {
            linkContext.fromCache = true;
            linkContext.videoFeed = value;
            //console.log(JSON.stringify(value) + 'FROM CACHE')
            SiteHandlerManager.prototype.fillVideoElement(linkContext);
        } else {
            SiteHandlerManager.prototype.fillVideoElement(linkContext);
            SiteHandlerManager.prototype.getHandler(linkContext.videoItem.type).loadVideoFeed(linkContext);
        }
    }

    SiteHandlerManager.prototype.playVideoFeed = function(videoFeed) {
        clearTimeout(SiteHandlerManager.prototype.errorTimeout)
        var siteHandler = SiteHandlerManager.prototype.getHandler(videoFeed.type)
        if(siteHandler) {
            SiteHandlerManager.prototype.showPlayer(siteHandler.playerContainer)
            siteHandler.playVideoFeed(videoFeed)
        }
    }

    SiteHandlerManager.prototype.hide = function(siteHandler) {
        $('#' + siteHandler.playerContainer).width('0%')
    }

    SiteHandlerManager.prototype.show = function(siteHandler) {
        $('#' + siteHandler.playerContainer).width('100%')
    }

    SiteHandlerManager.prototype.showPlayer = function(id) {
        id = id.replace(/^#?(.*)/, '#$1')
        id = $(id).attr('id')
        $.each(siteHandlers, function(index, item) {
            if(typeof(this.clearTimeout) == 'function') {
                this.clearTimeout()
            };
            if(this.playerContainer) {
                if(this.playerContainer == id) {
                    SiteHandlerManager.prototype.show(this)
                } else {
                    this.stop()
                    SiteHandlerManager.prototype.hide(this)
                }
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

    SiteHandlerManager.prototype.fillVideoElement = function(linkContext, fromCache) {
        var videoItem = linkContext.videoItem;
        var videoFeed = linkContext.videoFeed;
        var videoElement = linkContext.videoElement;
        var error = linkContext.error;
        var handler = SiteHandlerManager.prototype.getHandler(videoItem.type);
        if(videoFeed) {
            videoElement.div.html(handler.completeTemplate(videoFeed))
            videoElement.div.data('videoFeed', videoFeed)
            //todo workaround start
            videoElement.div.addClass('filled')
            //todo workaroung end
            if (!linkContext.fromCache) {
                SiteHandlerManager.prototype.setVideoFeed(videoFeed)
            }
        } else if(error) {
            videoElement.div.html(handler.errorTemplate(linkContext))
        } else {
            videoElement.div.html(handler.rawTemplate(videoItem))
            videoElement.div.data('videoFeed', videoItem)
            //todo workaround start
            videoElement.div.addClass('filled')
            //todo workaroung end
        }
//        if(window.playlist) {
//            playlist.debounceRecalculatePlaylist()
//        }
    }

    $.each(siteHandlers, function (index, item) {
        SiteHandlerManager.prototype.mapping[item.prefix] = item
    })
}

function YoutubeHandler() {
    YoutubeHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://cdn.ndtv.com/tech/images/youtube_logo_120.jpg"></div><span><b><%= id %></b></span></div>')
    YoutubeHandler.prototype.completeTemplate = _.template('<div><div class="image-div"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div></div><span><b><%= title %></b><br>by <%= uploader %></span></div>')
    YoutubeHandler.prototype.errorTemplate = _.template("<div><div class=\'image-div\'><img src=\'http://s.ytimg.com/yts/img/meh7-vflGevej7.png\'></div><span class=\'error-text\'><b><a href=\'http://www.youtube.com/watch?v=<%=videoItem.id%>\' target=\'_blank\'><%=error%></a></b></span></div>");
    YoutubeHandler.prototype.prefix = "y"
    YoutubeHandler.prototype.regex = /(youtu.be(\\?\/|\u00252F)|watch[^ \'\'<>]+v=|youtube.com\\?\/embed\\?\/|youtube.com\\?\/v\\?\/)([^\s&\'\'<>\/\\.,#]{11})/
    YoutubeHandler.prototype.regexGroup = 3
    YoutubeHandler.prototype.playerContainer = 'youtubeContainer'
    YoutubeHandler.prototype.loadVideoFeed = function (linkContext) {
        $.ajax({
            url:"http://gdata.youtube.com/feeds/api/videos/" + linkContext.videoItem.id + "?v=2&alt=jsonc",
            success:function (data) {
                try {
                    data.data.type = "y"
                    var videoFeed = new VideoFeed(data.data)
                    linkContext.videoFeed = videoFeed
                    SiteHandlerManager.prototype.fillVideoElement(linkContext)
                } finally {

                }
            },
            error:function (data) {
//                console.log(data.responseText)
                try {
                    linkContext.error = $.parseJSON(data.responseText).error.message
                } catch (e) {
                    linkContext.error = data.responseText.replace(/.*<code>(\w+)<\/code>.*/, "$1")
                }
                SiteHandlerManager.prototype.fillVideoElement(linkContext)
                if (data.responseText.match(/too_many_recent_calls/)) {
                    setTimeout(function () {
                        console.log("retrying video")
                        YoutubeHandler.prototype.loadVideoFeed(linkContext)
                    }, 35000)
                }
//                console.log("Unable to load: " + linksContext.videoElement.videoItem.id)
//                console.log(data)
//                console.log(linksContext)
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
    SoundCloudHandler.prototype.properties = { errorTimeout: null }
    SoundCloudHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://photos4.meetupstatic.com/photos/sponsor/9/5/4/4/iab120x90_458212.jpeg"></div><span><b><%= id %></b></span></div>')
    SoundCloudHandler.prototype.prefix = "s"
    SoundCloudHandler.prototype.regex = /((soundcloud.com\\?\/)|(a class="soundTitle__title.*href="))([^\s,?"=&#]+)/
    SoundCloudHandler.prototype.regexGroup = 4
    SoundCloudHandler.prototype.playerContainer = 'soundCloudContainer'
    SoundCloudHandler.prototype.clearTimeout = function() {
        clearTimeout(SoundCloudHandler.prototype.properties.errorTimeout)
    }
    SoundCloudHandler.prototype.loadVideoFeed = function (linksContext) {
//        playlist.debounceRecalculatePlaylist()
    }
    SoundCloudHandler.prototype.playVideoFeed = function(videoFeed) {
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
            scWidget.play()
        }})
    }
    SoundCloudHandler.prototype.stop = function() {
        scWidget.pause()
    }
}

function VimeoHandler() {
    VimeoHandler.prototype.rawTemplate = _.template('<div><div class="image-div"><img src="http://www.siliconrepublic.com/fs/img/news/201208/rs-120x90/vimeo.jpg"></div><span><b><%= id %></b></span></div>')
    VimeoHandler.prototype.completeTemplate = _.template('<div><div class="image-div"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div></div><span><b><%= title %></b><br>by <%= uploader %></span></div>')
    VimeoHandler.prototype.playerTemplate = _.template('<iframe id="vimeo" src="http://player.vimeo.com/video/<%= id %>?api=1&player_id=vimeo" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>')
    VimeoHandler.prototype.prefix = 'v'
    VimeoHandler.prototype.regex = /vimeo.com\\?\/([^\s&\'\'<>\/\\.,\"#]+)/
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
            url: 'http://vimeo.com/api/v2/video/' + linkContext.videoItem.id + '.json',
            success: function(data) {
//                console.log(JSON.stringify(data[0]))
                data[0].type = VimeoHandler.prototype.prefix
                linkContext.videoFeed = new VideoFeed(data[0])
                SiteHandlerManager.prototype.fillVideoElement(linkContext)
            },
            error: function(error) {
                console.log('error in vimeoHandler loadVideoFeed start')
                console.log(error)
                console.log('error in vimeoHandler loadVideoFeed end')
            },
            dataType: 'jsonp'
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