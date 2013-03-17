siteHandlers = [new YoutubeHandler()]

siteHandlerManager = new SiteHandlerManager();

function SiteHandlerManager() {
    this.mapping = new Object();
    that = this
    SiteHandlerManager.prototype.getHandler = function(type) {
        return this.mapping[type]
    }

    SiteHandlerManager.prototype.loadVideoFeed = function(linkContext) {
        var handler = this.mapping[linkContext.videoItem.type]
        if(handler) {
            handler.loadVideoFeed(linkContext)
        } else {
            console.log('Unable to load video with type ' + linkContext.videoItem.type)
            console.log(linkContext)
        }
    }

    $.each(siteHandlers, function (index, item) {
        that.mapping[item.prefix] = item
    })
}

function YoutubeHandler() {
    YoutubeHandler.prototype.loadVideoFeed = function(linksContext) {
        $.ajax({
            url:"http://gdata.youtube.com/feeds/api/videos/" + linksContext.videoItem.id + "?v=2&alt=jsonc",
            success:function (data) {
                try {
                    var videoFeed = new VideoFeed(data.data)
                    linksContext.videoElement.fillDiv(videoFeed)
                } finally {
                    linksContext.playlistFinishedLoading(linksContext.links.length, ++(linksContext.responseCounterWrapper.responseCounter))
                }
            },
            error:function (data) {
//                console.log(data.responseText)
                try {
                    linksContext.message = $.parseJSON(data.responseText).error.message
                } catch (e) {
                    linksContext.message = data.responseText.replace(/.*<code>(\w+)<\/code>.*/, "$1")
                }
                var errorDiv = _.template("<div class='image-div'><img src='http://s.ytimg.com/yts/img/meh7-vflGevej7.png'></div><span class='error-text'><b><a href='http://www.youtube.com/watch?v=<%=videoItem.id%>' target='_blank'><%=message%></a></b></span>");
//                console.log(errorDiv(linksContext))
                linksContext.videoElement.div.html(errorDiv(linksContext))
                if (data.responseText.match(/too_many_recent_calls/)) {
                    setTimeout(function () {
                        console.log("retrying video")
                        YoutubeHandler.prototype.loadVideoFeed(linksContext)
                    }, 10000)
                } else {
                    linksContext.playlistFinishedLoading(linksContext.links.length, ++(linksContext.responseCounterWrapper.responseCounter))
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
    YoutubeHandler.prototype.regexGroup = 4
}