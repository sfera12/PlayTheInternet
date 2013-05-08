siteHandlers = [new YoutubeHandler(), new SoundCloudHandler()]

siteHandlerManager = new SiteHandlerManager();

function SiteHandlerManager() {
    SiteHandlerManager.prototype.mapping = new Object();
    SiteHandlerManager.prototype.store = datajs.createStore('VideoId', 'dom')
    SiteHandlerManager.prototype.getHandler = function (type) {
        return SiteHandlerManager.prototype.mapping[type]
    }

    SiteHandlerManager.prototype.setVideoFeed = function (videoFeed) {
        this.store.addOrUpdate(videoFeed.id,
            videoFeed,
            function (key, value) {
//                console.log(key + " persisted in store successfully")
//                console.log(value)
            }, function (error) {
                console.log(error)
                console.log('error in persisting to store')
            })
    }

    SiteHandlerManager.prototype.getHandler = function(type) {
        var handler = SiteHandlerManager.prototype.mapping[type]
        if (handler) {
            return handler
        } else {
            console.log('Missing site handler for type: ' + type)
            console.log(type)
            return null
        }
    }

    SiteHandlerManager.prototype.loadVideoFeed = function (linkContext) {
        SiteHandlerManager.prototype.store.read(linkContext.videoItem.id, function (key, value) {
//                console.log(value)
                if (value != undefined) {
                    linkContext.videoElement.fillDiv(value)
                } else {
                    SiteHandlerManager.prototype.getHandler(linkContext.videoItem.type).loadVideoFeed(linkContext);
                }
            },
            function (error) {
                console.log(error)
                console.log('error in reading videoFeed from dom store')
            })
    }

    SiteHandlerManager.prototype.playVideoFeed = function(videoFeed) {
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
            yte.playNextVideo()
        } else if (state == "ERROR") {
            setTimeout(function () {
                yte.playNextVideo()
            }, 2000)
        }
    }

    $.each(siteHandlers, function (index, item) {
        SiteHandlerManager.prototype.mapping[item.prefix] = item
    })
}

function YoutubeHandler() {
    YoutubeHandler.prototype.loadVideoFeed = function (linksContext) {
        $.ajax({
            url:"http://gdata.youtube.com/feeds/api/videos/" + linksContext.videoItem.id + "?v=2&alt=jsonc",
            success:function (data) {
                try {
                    data.data.type = "y"
                    var videoFeed = new VideoFeed(data.data)
                    linksContext.videoElement.fillDiv(videoFeed)
                } finally {

                }
            },
            error:function (data) {
//                console.log(data.responseText)
                try {
                    linksContext.message = $.parseJSON(data.responseText).error.message
                } catch (e) {
                    linksContext.message = data.responseText.replace(/.*<code>(\w+)<\/code>.*/, "$1")
                }
                var errorDiv = _.template("<div><div class=\'image-div\'><img src=\'http://s.ytimg.com/yts/img/meh7-vflGevej7.png\'></div><span class=\'error-text\'><b><a href=\'http://www.youtube.com/watch?v=<%=videoItem.id%>\' target=\'_blank\'><%=message%></a></b></span></div>");
//                console.log(errorDiv(linksContext))
                linksContext.videoElement.div.html(errorDiv(linksContext))
                if (data.responseText.match(/too_many_recent_calls/)) {
                    setTimeout(function () {
                        console.log("retrying video")
                        YoutubeHandler.prototype.loadVideoFeed(linksContext)
                    }, 10000)
                }
//                console.log("Unable to load: " + linksContext.videoElement.videoItem.id)
//                console.log(data)
//                console.log(linksContext)
            },
            context:linksContext,
            dataType:'json'
        })
    }

    YoutubeHandler.prototype.prefix = "y"
    YoutubeHandler.prototype.regex = /(youtu.be(\/|\u00252F)|watch[^ \'\'<>]+v=|youtube.com\/embed\/|youtube.com\/v\/)([^ &\'\'<>\/\\.,]{11})/
    YoutubeHandler.prototype.regexGroup = 3
    YoutubeHandler.prototype.playerContainer = 'youtubeContainer'
    YoutubeHandler.prototype.playVideoFeed = function (videoFeed) {
        var videoId = videoFeed.id
        yte.ytp.loadVideoById(videoId)
    }
    YoutubeHandler.prototype.stop = function() {
        yte.ytp.stopVideo()
    }
}

function SoundCloudHandler() {
    SoundCloudHandler.prototype.template = _.template('<div><div class="image-div"><img src="http://photos4.meetupstatic.com/photos/sponsor/9/5/4/4/iab120x90_458212.jpeg"></div><span><b><%= id %></b></span></div>')
    SoundCloudHandler.prototype.prefix = "s"
    SoundCloudHandler.prototype.regex = /((soundcloud.com\/)|(a class="soundTitle__title.*href="))([^ ,?"]+)/
    SoundCloudHandler.prototype.regexGroup = 4
    SoundCloudHandler.prototype.playerContainer = 'soundCloudContainer'
    SoundCloudHandler.prototype.loadVideoFeed = function (linksContext) {
        var container = linksContext.videoElement.div;
        container.html(SoundCloudHandler.prototype.template(linksContext.videoItem))
        container.data('videoFeed', linksContext.videoItem)
        yte.pla.debounceRecalculatePlaylist()
    }
    SoundCloudHandler.prototype.playVideoFeed = function(videoFeed) {
        scWidget.load('https://w.soundcloud.com/player/?url=' + videoFeed.id.replace(/^\/?(.*)/, '/$1'), {callback: function() {
            scWidget.play()
        }})
    }
    SoundCloudHandler.prototype.stop = function() {
        scWidget.pause()
    }
}