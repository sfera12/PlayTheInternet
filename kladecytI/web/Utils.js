function VideoFeed(item, parent) {
    if (item == null) throw "kladecyt: null vId argument in VideoFeed Constructor"
    if (item.thumbnail != null) {
        this.videoId = item.id
        this.duration = item.duration
        this.durationCaption = convert(item.duration)
        this.title = item.title
        this.uploader = item.uploader
        this.thumbnail = item.thumbnail.sqDefault
    } else if (item.id.$t != "") {
        this.videoId = item.id.$t.replace(/.*video\:(.*)/, "$1")
        this.duration = item.media$group.media$content[0].duration
        this.durationCaption = convert(this.duration)
        this.title = item.title.$t
        this.uploader = item.author[0].name.$t
        this.thumbnail = item.media$group.media$thumbnail[0].url
    } else {
        this.error = "incompatible type"
        console.log("incompatible type" + item)
    }
}

function VideoElement(videoFeed, appendTo) {
    var div

    this.createDiv = function (videoFeed) {
        this.div = $('<div/>')
        this.div.addClass('ui-state-default')
        $(appendTo).append(this.div)
        if (videoFeed != null) {
            this.fillDiv(videoFeed)
        }
    }

    this.fillDiv = function (videoFeed) {
        var durationCaption = $('<div/>')
        durationCaption.addClass('duration-caption')
        durationCaption.text(videoFeed.durationCaption)

        var imgDiv = $('<div/>')
        imgDiv.addClass('image-div')

        var img = $('<img/>')
        img.attr('src', videoFeed.thumbnail)

        var span = $('<span/>')
        var b = $('<b>').text(videoFeed.title)
        span.append(b)
        span.append("<br>by " + videoFeed.uploader)

        var buttonSpan = $('<span style="float: left; width: 12px; height: 90px;"/>')
        var closeButton = $('<img style="width: 10px; height: 10px;" src="/jqC/css/custom/close.jpg">')
        buttonSpan.append(closeButton)

        imgDiv.append(img)
        imgDiv.append(durationCaption)
        this.div.append(imgDiv)
        this.div.append(buttonSpan)
        this.div.append(span)
        this.div.click(function (evt) {
            yte.playVideoDiv(this.div[0])
        }.bind(this))
        closeButton.click(function (evt) {
            evt.stopPropagation()
            this.toggleClass("disabled-Video")
            yte.pla.recalculatePlaylist()
        }.bind(this.div))
        durationCaption.css('left', 120 - durationCaption.width() - 3)
        durationCaption.css('top', 90 - durationCaption.height() - 3)

        this.div.data("videoFeed", videoFeed)

        return this.div
    }

    this.createDiv(videoFeed)

    return this
}

function Playlist(appendToElementExpression) {
    this.containerElementExpression = appendToElementExpression
    this.playlist
    this.currSong

    this.recalculatePlaylist = function () {
        this.playlist = $(this.containerElementExpression + " div").filter(function (index, item) {
//            console.log($(item).hasClass("disabled-Video"))
            item = $(item)
            return item.data("videoFeed") != null && !(item.hasClass("disabled-Video"))
        })
    }

    this.lookupNextSong = function (currSong) {
        var index = this.playlist.toArray().indexOf(currSong)
        index = index >= this.playlist.length - 1 ? 0 : ++index
        return this.playlist[index]
    }

    this.addSongsToPlayList = function (appendToElementExpression, links, finished, unique) {
        var responseCounterWrapper = {
            responseCounter:0
        }
        var playlistFinishedLoading = function (playlistSize, current) {
            if (playlistSize == current) {
                this.recalculatePlaylist()
                if (finished != null) {
                    finished()
                }
            }
        }.bind(this)
        if (unique == true) {
            var oldLinks = this.playlistSongIds()
            links = links.filter(function (newId) {
                return oldLinks.indexOf(newId) == -1 ? true : false
            })
        }

        links.forEach(function (videoId) {
            var videoElement = new VideoElement(null, appendToElementExpression)
            videoElements.push(videoElement)
            var linksContext = {
                responseCounterWrapper:responseCounterWrapper,
                videoElement:videoElement,
                playlistFinishedLoading:playlistFinishedLoading,
                links:links,
                videoId:videoId,
                retryCounter:0
            }
            loadVideo(linksContext);
        })
    }

    function loadVideo(linksContext) {
        $.ajax({
            url:"http://gdata.youtube.com/feeds/api/videos/" + linksContext.videoId + "?v=2&alt=jsonc",
            success:function (data) {
                try {
                    var videoFeed = new VideoFeed(data.data)
                    linksContext.videoElement.fillDiv(videoFeed)
                } finally {
                    linksContext.playlistFinishedLoading(linksContext.links.length, ++(linksContext.responseCounterWrapper.responseCounter))
                }
            },
            error:function (data) {
                if (data.responseText.match(/too_many_recent_calls/)) {
                    setTimeout(function () {
                        console.log("retrying video")
                        loadVideo(linksContext)
                    }, 10000)
                } else {
                    linksContext.playlistFinishedLoading(linksContext.links.length, ++(linksContext.responseCounterWrapper.responseCounter))
                }
                console.log("Unable to load: " + linksContext.videoElement.videoId)
                console.log(data)
            },
            context:linksContext,
            dataType:'json'
        })
    }

    this.parseSongIds = function (text) {
        var youtube = /y=([^ &\"\'<>\/\\,]{11})/g
        var youtubeLinks = text.match(youtube)
        return youtubeLinks.map(function (item) {
            return item.replace(youtube, "$1")
        }).unique()
    }

    this.playlistSongIds = function () {
        return this.playlist.map(function (index, div) {
            return $(div).data('videoFeed').videoId
        }).toArray()
    }
}

function YoutubePlayer(ytp, pla) {
    this.ytp
    this.pla = pla

    if (ytp != null) {
        this.setPlayer(ytp)
    }

    this.setPlayer = function (ytp) {
        if (ytp != null) {
            this.ytp = ytp
            this.playVideoDiv(this.pla.currSong)
        }
    }

    this.drawPlayer = function (appendToElementId) {
        this.pla.recalculatePlaylist()
        this.pla.currSong = this.pla.playlist[0]
        var videoFeed = $(this.pla.currSong).data("videoFeed")
        var params = { allowScriptAccess:"always", allowFullScreen:"true" };
        var atts = { id:"ytplayer" };
        var playerWidth = ytPlayerHolder.width() - 9
        swfobject.embedSWF("http://www.youtube.com/v/" + videoFeed.videoId + "?enablejsapi=1&playerapiid=ytplayer&version=3", appendToElementId, parseInt(playerWidth), parseInt(playerWidth / 1.19), "8", null, null, params, atts);
    }

    this.resizePlayer = function (ytPlayerHolder) {
        var playerWidth = ytPlayerHolder.width() - 9
        var playerHeight = parseInt(playerWidth / 1.19)
        var ytplayer = $('#ytplayer')
        ytplayer.width(playerWidth)
        ytplayer.height(playerHeight)
    }

    this.playVideoDiv = function (videoDiv) {
        $(this.pla.currSong).removeClass("selected")
        this.pla.currSong = videoDiv
        $(this.pla.currSong).addClass("selected")
        var videoFeed = $(videoDiv).data('videoFeed')
        document.title = 'Play - ' + videoFeed.title
        this.playVideoFeed(videoFeed)
    }

    this.playVideoFeed = function (videoFeed) {
        var videoId = videoFeed.videoId
        this.ytp.loadVideoById(videoId)
    }

    this.playNextVideo = function () {
        this.playVideoDiv(this.pla.lookupNextSong(this.pla.currSong))
    }

    this.onStateChange = function (state) {
        console.log("change " + state)
        if (state == 0) {
            this.playNextVideo()
        }
    }
}

function GUID() {
    var S4 = function () {
        return Math.floor(
            Math.random() * 0x10000 /* 65536 */
        ).toString(16);
    };

    return (
        S4() + S4()
        );
}

function convert(duration) {
    var tbl = [
        [ 7 * 24 * 60 * 60, 'week' ],
        [ 24 * 60 * 60, 'day' ],
        [ 60 * 60, 'hour' ],
        [ 60, 'minute' ],
        [ 1, 'second' ]
    ];
    var t = parseInt(duration);
    var r = '';
    var out = [];
    for (var i = 0; i < tbl.length; i++) {
        var d = tbl[i];
        if (t > d[0]) {
            var u = Math.floor(t / d[0]);
            t -= u * d[0];
            u < 10 ? out.push('0' + u) : out.push(u)
        } else if (i >= 3) {
            out.push('00')
        }
    }
    return out.join(":")
}

Array.prototype.unique =
    function () {
        var a = [];
        var l = this.length;
        for (var i = 0; i < l; i++) {
            for (var j = i + 1; j < l; j++) {
                // If this[i] is found later in the array
                if (this[i] === this[j])
                    j = ++i;
            }
            a.push(this[i]);
        }
        return a;
    };