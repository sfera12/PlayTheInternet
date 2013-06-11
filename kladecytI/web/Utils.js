function VideoElement(videoFeed, appendTo) {
    var div

    this.createDiv = function (videoFeed) {
        var childDiv = $('<div/>')
        this.div = $('<div/>').append(childDiv)
        this.div.addClass('pti-state-default')
        this.div.attr('id', videoFeed.type + '=' + videoFeed.id)
        $(appendTo).append(this.div)
//            if (videoFeed != null) {
//                this.fillDiv(videoFeed)
//            }
    }

    this.fillDiv = function (videoFeed) {
        this.div.empty()
        childDiv = $('<div/>').appendTo(this.div)
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
        childDiv.append(imgDiv)
//        childDiv.append(buttonSpan)
        childDiv.append(span)
        closeButton.click(function (evt) {
            evt.stopPropagation()
            this.toggleClass("disabled-Video")
            playlist.recalculatePlaylist()
        }.bind(childDiv))
        durationCaption.css('left', 120 - durationCaption.width() - 3)
        durationCaption.css('top', 90 - durationCaption.height() - 3)

        this.div.data("videoFeed", videoFeed)
        SiteHandlerManager.prototype.setVideoFeed(videoFeed)
//        playlist.debounceRecalculatePlaylist()

        return this.div
    }

    this.createDiv(videoFeed)

    return this
}

function VideoFeed(item, parent) {
    if (item == null) throw "kladecyt: null vId argument in VideoFeed Constructor"
    if (item.thumbnail != null) {
        this.id = item.id
        this.type = item.type
        this.duration = item.duration
        this.durationCaption = convert(item.duration)
        this.title = item.title
        this.uploader = item.uploader
        this.thumbnail = item.thumbnail.sqDefault
    } else if (item || item.url || item.url.contains('vimeo')) {
        this.id = item.id
        this.type = item.type
        this.duration = item.duration
        this.durationCaption = convert(item.duration)
        this.title = item.title
        this.uploader = item.user_name
        this.thumbnail = item.thumbnail_medium
    } else {
        this.error = "incompatible type"
        console.log("incompatible type" + item)
    }
}

function IntercomWrapper(windowId) {
    if (window.intercom) {
        window.intercom.handlers = []
    }
    Intercom.destroy()
    window.intercom = Intercom.getInstance()
    window.intercom.on(windowId + 'playlistReceived', function (data) {
        try {
            playlist.addSongsToPlaylist(data.message, true)
        } finally {
            intercom.emit(data.sender + 'playlistReceived', { sender:windowId, ctrl:data.ctrl, type:'playlistReceived', status:'success'})
        }
        console.log(data)
    });
    window.intercom.on('windowId', function (data) {
        intercom.emit(data.sender + 'windowId', { sender:windowId })
    });
}

function Playlist(appendToElementExpression, options) {
    this.options = options
    this.containerElementExpression = appendToElementExpression
    this.jPlaylist = $(this.containerElementExpression)
    this.playlist
    this.currSong
    this.id
    Playlist.prototype.groupHeaderTemplate = _.template('<label class="pti-state-droppable-target"><%=date%></label>')

    var blockSort = false;
    $(this.containerElementExpression).sortable({
        connectWith:'.connectedSortable',
        scrollSensitivity:50,
        tolerance:'pointer',
        distance:25,
//        update:function (event, ui) {
//            this.recalculatePlaylist()
//        }.bind(this),
        cancel:'.pti-state-droppable-target'
    }).on('sortreceive', function () {
        blockSort = false;
//        this.recalculatePlaylist()
        console.log(this)
        console.log('receive')
    }.bind(this)).on('sortstop', function (e) {
        console.log(this)
        console.log(blockSort + ' sortstop')
        if (blockSort) {
            e.preventDefault();
        } else {
            console.log('recalculate')
        }
        blockSort = true;
    }.bind(this))

    Playlist.prototype.listenFunction = function(key, action) {
        console.log(key + ' has been ' + action)
        console.log(this.jPlaylist.sortable('toArray'))
        console.log($.jStorage.get(key))
        arrayEq = function(a, b) {
            return _.all(_.zip(a, b), function(x) {
                return x[0] === x[1];
            });
        };
        if(arrayEq(this.jPlaylist.sortable('toArray'), $.jStorage.get(key))) {
            console.log('nothing changed')
        } else {
            var videoFeed = this.jPlaylist.find('.selected').data('videoFeed');
            if(videoFeed) {
                var id = '#' + videoFeed.type + '\\=' + videoFeed.id
            }
            console.log(this.jPlaylist)
            this.jPlaylist.empty()
            this.addSongsToPlaylist(this.parseSongIds($.jStorage.get(key).join(',')))
            if(videoFeed) {
                this.jPlaylist.find(id).addClass('selected')
            }
        }
        if(this.options && typeof this.options.listenKeyChangeCallback == 'function') {
            this.options.listenKeyChangeCallback(this)
        }
    }

    Playlist.prototype.setId = function(id) {
        $.jStorage.stopListening(id, this.listenFunction)
        this.id = id
        this.listenFunction(id, 'custom call')
        $.jStorage.listenKeyChange(id, this.listenFunction.bind(this))
    }

    this.recalculatePlaylist = function () {
        this.playlist = $(this.containerElementExpression + " div.pti-state-default").filter(function (index, item) {
//            console.log($(item).hasClass("disabled-Video"))
            item = $(item)
            return item
        })

        if(this.id) {
            $.jStorage.set(this.id, this.jPlaylist.sortable('toArray'))
        }
    }

    Playlist.prototype.playlistVideos = function() {
        return _.map($(this.containerElementExpression + '> div'), function(item) { return $(item).data('videoFeed') })
    }

    this.debounceRecalculatePlaylist = _.debounce(function () {
        this.recalculatePlaylist();
        console.log('playFirstLoaded debounce')
        if(typeof playFirstLoaded == "function") {
            playFirstLoaded();
        }
    }, 300)

    Playlist.prototype.buildHash = function () {
        return "#" + _.reduce(this.playlistSongIds(), function (memo, videoId) {
            return memo.concat("y=" + videoId + ",")
        }, "")
    }

    Playlist.prototype.lookupNextSong = function () {
        var index = $(this.containerElementExpression).find('div.pti-state-default').index($(this.containerElementExpression).find('div.selected'))
        index = index >= this.playlist.length - 1 ? 0 : ++index
        return this.playlist[index]
    }

    this.addCalendarSongsToPlaylist = function (days) {
        days.forEach(function (day) {
            console.log(day.date)
            this.jPlaylist.append(Playlist.prototype.groupHeaderTemplate(day))
            day.links.forEach(function (videoFeed) {
                console.log(videoFeed)
                var videoElement = new VideoElement(videoFeed, this.containerElementExpression)
                var linkContext = {
                    videoElement:videoElement,
                    videoFeed:videoFeed,
                    retryCounter:0,
//                    loadVideoFeedCallback:afterLoadVideoFeed ? afterLoadVideoFeed : null
                }
                siteHandlerManager.loadVideoFeed(linkContext)
                this.debounceRecalculatePlaylist()
            }.bind(this))
        }.bind(this))
    }

    this.addSongsToPlaylist = function (links, unique, loadVideoFeedCallback) {
        if (unique == true) {
            var oldLinks = this.parseSongIds(this.jPlaylist.sortable('toArray').join(','))
            links = _.filter(links, function (newSong) {
                return !_.findWhere(oldLinks, newSong)
            })
        }

        links = _.filter(links, function(validSong) {
            return (validSong.id && validSong.type)
        })

        if(typeof loadVideoFeedCallback == "function") {
            var afterLoadVideoFeed = _.after(links.length, loadVideoFeedCallback)
        }

        links.forEach(function (videoFeed) {
            var videoElement = new VideoElement(videoFeed, this.containerElementExpression)
            var linkContext = {
                videoElement:videoElement,
                videoFeed:videoFeed,
                retryCounter:0,
                loadVideoFeedCallback: afterLoadVideoFeed
            }
            siteHandlerManager.loadVideoFeed(linkContext)
            this.debounceRecalculatePlaylist()
        }.bind(this))
    }

    Playlist.prototype.parseSongIds = function (text) {
        return text.replace(/.*#/, '').split(',').map(function (item) {
            return {type:item.replace(/=.*/, ''), id:item.replace(/.*=/, '')}
        })
    }

    Playlist.prototype.playlistSongIds = function () {
        if (this.playlist) {
            return this.playlist.map(function (index, div) {
                return $(div).data('videoFeed').id
            }).toArray()
        } else {
            return new Array()
        }
    }

    Playlist.prototype.playVideoDiv = function (videoDiv) {
        var videoFeed = $(videoDiv).data('videoFeed')
        if (videoFeed) {
            this.jPlaylist.children().removeClass("selected")
            this.currSong = videoDiv
            $(this.currSong).addClass("selected")
            document.title = windowId + ' - ' + videoFeed.title
            SiteHandlerManager.prototype.playVideoFeed(videoFeed)
        } else {
            throw "videoFeed is empty"
        }
    }

    Playlist.prototype.playNextVideo = function () {
        playlist.playVideoDiv(playlist.lookupNextSong())
    }

    if(options && options.id) {
        this.setId(options.id)
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
        }
    }

    this.drawPlayer = function (appendToElementId) {
//        playlist.currSong = playlist.playlist[0]
//        var videoFeed = $(playlist.currSong).data("videoFeed")
        var params = { allowScriptAccess:"always", allowFullScreen:"true" };
        var atts = { id:"ytplayer" };
        var playerWidth = $('#firstView').width() - 9
        swfobject.embedSWF("http://www.youtube.com/v/MK6TXMsvgQg?enablejsapi=1&playerapiid=ytplayer&version=3", appendToElementId, parseInt(playerWidth), parseInt(playerWidth / 1.642), "8", null, null, params, atts);
    }


    this.onStateChange = function (state) {
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


var setSlimScroll = function (elementExpression, height) {
    $(elementExpression).slimScroll({
        height:height,
        color:'rgb(0, 50, 255)',
        railVisible:true,
        railColor:'#000000',
        disableFadeOut:true
    });
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

function formatDate(dateObj) {
    var month = dateObj.getUTCMonth();
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var newdate = ("0" + day).slice(-2) + "-" + ("0" + month).slice(-2) + "-" +  year;
    return newdate
}

function calendarSorted(callback) {
    $.ajax({url:'/calendarSorted?start=0', success:function (data) {
        console.log(data)
        window.calendarData = data
        typeof callback == "function" && callback(data)
    }})
}

var reduce = function (sortedData) {
    return _.flatten(_.reduce(sortedData, function (memo, item) {
        _.each(item.data, function (item) {
            item.date = this.meta.date
        }, item)
        memo.push(item.data);
        return memo
    }, new Array()))
}
var groupBy = function (links) {
    return _.groupBy(links, function (item) {
        return formatDate(new Date(item.date))
    })
}
var map = function (grouped) {
    return _.map(grouped, function (item) {
        return {'date':item[0], links:_.uniq(item[1], function (item) {
            return item.id + item.type
        })}
    })
}
var compose = _.compose(map, _.pairs, groupBy)