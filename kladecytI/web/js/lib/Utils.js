function VideoElement(videoFeed, appendTo) {
    var div

    this.createDiv = function (videoFeed) {
        var childDiv = $('<div/>')
        this.div = $('<div/>').append(childDiv)
        this.div.addClass('pti-element-song')
        this.div.attr('id', videoFeed.type + '=' + videoFeed.id)
        $(appendTo).append(this.div)
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


function Playlist(appendToElementExpression, options) {
    Playlist.prototype.groupHeaderTemplate = PTITemplates.prototype.PlaylistGroupHeaderTemplate
    this.options = options
    this.containerElementExpression = appendToElementExpression
    this.jContainer = $(this.containerElementExpression)
    this.jHeader = $('<div class="header"/>').appendTo(this.jContainer)
    this.jPlaylist = $('<div class="playlist connectedSortable"><div class="pti-make-last-droppable-work"/></div>').appendTo(this.jContainer)
    this.sortableArray = new Array()
    this.playlist
    this.currVideoDiv
    this.id
    this.currVideoFeed
    var self = this
    this.first_rows = {}
    this.blockSort = false
    this.uid = GUID() + new Date().getTime()


    Playlist.prototype.createHeader = function () {
        var bigView = $('<div class="set-big-view size-button">BIG</div>').appendTo(this.jHeader)
        var listView = $('<div class="set-list-view size-button">LIST</div>').appendTo(this.jHeader)
        bigView.click(function () {
            $(this.jPlaylist).attr('class', function (i, c) {
                return c.replace(/pti-view-[^\s]+/g, 'pti-view-big')
            }.bind(this))
        }.bind(this))
        listView.click(function () {
            $(this.jPlaylist).attr('class', function (i, c) {
                return c.replace(/pti-view-[^\s]+/, 'pti-view-list')
            }.bind(this))
        }.bind(this))
    }
    if (this.createHeader) {
        this.createHeader()
    }

    Playlist.prototype.hideGroupContents = function (element) {
        var headerTagName = element[0].tagName;
        var headers = this.jPlaylist.find(headerTagName)
        var headerIndex = headers.index(element)
        var playlistElements = calendarPlaylist.jPlaylist.find('>*')
        var childStartIndex = playlistElements.index(element) + 1;
        var childEndIndex = 9999
        if (!(headerIndex == headers.length - 1)) {
            childEndIndex = playlistElements.index(headers[headerIndex + 1])
        }
        this.jPlaylist.find('>*').slice(childStartIndex, childEndIndex).toggleClass('display-none')
//        console.log(headerTagName); console.log(headers); console.log(headerIndex); console.log(childStartIndex); console.log(childEndIndex)
    }

    this.jPlaylist.data('playlist', this)
    this.jPlaylist.addClass('pti-view-list')
    if (this.options && this.options.type && this.options.type == 'calendar') {
        this.jPlaylist.addClass('calendar')
    }

    var sortableSlimScroll = { scroll: false }
    this.jPlaylist.data('sortableSlimScroll', sortableSlimScroll)
    this.jPlaylist.selectable({
        filter:'div.pti-element-song',
        cancel:'div.image-div, label.pti-droppable-target, div.pti-make-last-droppable-work, a'
    })
        .sortable({
            connectWith:'.connectedSortable',
            scrollSensitivity:50,
            tolerance:'pointer',
            distance:7,
            handle:'div.image-div',
            placeholder:'pti-sortable-placeholder',
//            update:function (event, ui) {
//                this.recalculatePlaylist()
//            }.bind(this),
            cancel:'.pti-droppable-target, .pti-make-last-droppable-work',
//        sort : function(event, ui) {
//            var $helper = $('.ui-sortable-helper'), hTop = $helper.offset().top, hStyle = $helper.attr('style'), hId = $helper.attr('id');
//            if (first_rows.length > 1) {
//                $.each(first_rows, function(i, item) {
////                    if (hId != item.id) {
////                        var _top = hTop + (26 * i);
////                        $('#' + item.id).addClass('ui-sortable-helper').attr('style', hStyle).css('top', _top);
////                    }
//                });
//            }
//        },
            start:function (event, ui) {
                $('.cloned').removeClass('cloned')
                if (options && options.type == 'calendar') {
                    this.blockSort = true
                }
//                console.log('start')
//                console.log(this)
                if (ui.item.hasClass('ui-selected') && this.jPlaylist.find('.ui-selected').length > 1) {
                    this.first_rows = this.jPlaylist.find('.ui-selected').map(function (i, e) {
                        var $tr = $(e);
                        return {
                            tr:$tr.clone(true),
                            id:$tr.attr('id')
                        };
                    }).get();
                    this.jPlaylist.find('.ui-selected').addClass('cloned');
                }
//                ui.placeholder.html('<td class="pti-view-big">&nbsp;</td>');
            }.bind(this),
            stop:function (event, ui) {
//                console.log('stop')
//                console.log(this)
                if (this.blockSort) {
//                    console.log('preventDefault')
                    event.preventDefault()
                } else {
//                    console.log('preventDefaultElse')
                    var targetParent = ui.item.parent().data('playlist')
//                    console.log(targetParent)
//                    console.log(this.first_rows)
                    if (this.first_rows.length > 1) {
                        $.each(this.first_rows, function (i, item) {
                            var logItem = $(item.tr).removeAttr('style').insertBefore(ui.item);
//                            console.log(logItem)
                        });
                        $('.cloned').remove();
                    }
                    $("#uber tr:even").removeClass("odd even").addClass("even");
                    $("#uber tr:odd").removeClass("odd even").addClass("odd");
                    this.recalculatePlaylist()
                    targetParent != this && targetParent.recalculatePlaylist()
                }
                this.first_rows = {};
                this.blockSort = false
            }.bind(this),
            remove:function (event, ui) {
//                console.log('remove')
//                console.log(this)
                this.blockSort = false
            }.bind(this)
//        ,receive: function(event, ui) {
//            _.defer(function () {
//                this.recalculatePlaylist()
//            }.bind(this))
//        }.bind(this)
        }).hover(function() {
            sortableSlimScroll.scroll = true
        }, function() {
            sortableSlimScroll.scroll = false
        })

//    if(options && options.type == "calendar") {
//        //todo use later
////        this.jPlaylist.removeClass('connectedSortable')
////        this.jPlaylist.addClass('calendarSortable')
//        var blockSort = false;
//        this.jPlaylist.on('sortstart', function () {
//            blockSort = true
//            console.log('start')
//            console.log(this)
//        }.bind(this))
////        this.jPlaylist.on('sortreceive', function(event, ui) {
//////            blockSort = false
////            console.log('receive')
////            console.log(this)
////        }.bind(this))
//        this.jPlaylist.on('sortstop', function (event, ui) {
//            if (blockSort) {
//                event.preventDefault()
//                console.log('preventDefault')
//                console.log(this)
//            } else {
//                //todo remove else
//                console.log('preventDefault else')
//                console.log(this)
//            }
//            blockSort = false
//        }.bind(this))
//        this.jPlaylist.on('sortremove', function(event, ui) {
//            blockSort = false
//            console.log('remove')
//            console.log(this)
//        }.bind(this))
//    }

    Playlist.prototype.manualRedrawPlaylistFromCache = function () {
        Playlist.prototype.genericRedrawPlaylistFromCache.call(this, this.id, 'manual redraw from cache', 'manual redraw playlist from cache')
    }

    Playlist.prototype.listenRedrawPlaylistFromCache = function (key, action) {
        Playlist.prototype.genericRedrawPlaylistFromCache.call(this, this.id, action, 'listener redraw playlist from cache', true)
    }

    Playlist.prototype.genericRedrawPlaylistFromCache = function (key, action, functionName, filterOwn) {
        var storagePlaylist = Playlist.prototype.getGenericCacheObject.call(this, key, action, functionName, filterOwn)
        storagePlaylist && Playlist.prototype.redrawPlaylist.call(this, storagePlaylist)
        this.options && typeof this.options.listenKeyChangeCallback == 'function' && this.options.listenKeyChangeCallback(this)
    }

    Playlist.prototype.getGenericCacheObject = function (key, action, functionName, filterOwn) {
        console.log(key + ' has been ' + action)
        var storageData = $.jStorage.get(key);
        console.log(storageData)
        if (!storageData) {
            console.log(functionName + " called with empty or null storageData")
            return
        }
        if (!(filterOwn && storageData.source == this.uid)) {
            return storageData
        } else {
            console.log('not talking to self')
        }
    }

    Playlist.prototype.redrawPlaylist = function (storagePlaylist) {
        if (storagePlaylist) {
            var storageSelectedVideoFeed = $.jStorage.get(this.id + '_selected')
            var selectedVideoFeed = storageSelectedVideoFeed && storageSelectedVideoFeed.data
            var selectVideoCallback = null
            var videoFeed = this.currVideoFeed
            if (selectedVideoFeed || videoFeed) {
                selectVideoCallback = function () {
                    var id = ''
                    selectedVideoFeed ? id += Playlist.prototype.concatId(selectedVideoFeed.type, selectedVideoFeed.id) : id += Playlist.prototype.concatId(videoFeed.type, videoFeed.id)
//                    var id = '#' + Playlist.prototype.escapeUrl(videoFeed.type, videoFeed.id)
                    console.log(id)
                    var findDiv = this.jPlaylist.find(id)[0];
                    findDiv && this.selectVideo({ videoDiv:findDiv }, {dontCache:true})
                }.bind(this)
            }
            storagePlaylist = storagePlaylist.data
            this.recalculateSortableArray()
//            console.log(storagePlaylist)
//            console.log(this.sortableArray)
            arrayEq = function (a, b) {
                return _.all(_.zip(a, b), function (x) {
                    return x[0] === x[1];
                });
            };
            if (arrayEq(this.sortableArray, storagePlaylist)) {
                console.log('nothing changed')
            } else {
//                console.log(this.jPlaylist)
                this.playlistEmpty()
                this.addSongsToPlaylist(this.parseSongIds(storagePlaylist.join(',')), null, null, true)
            }
        }
        selectVideoCallback && typeof selectVideoCallback == "function" && selectVideoCallback()
    }

    this.playlistEmpty = function() {
        this.jPlaylist.html('<div class="pti-make-last-droppable-work"/>')
    }.bind(this)

    Playlist.prototype.listenPlaySelectedVideo = function (key, action) {
        var storageData = Playlist.prototype.getGenericCacheObject.call(this, key, action, 'listen play selected video', true)
        storageData && storageData.data && this.playVideo({videoFeed:storageData.data}, storageData.playerState, {dontCache:true})
    };

//    Playlist.prototype.manualRedrawSelectedVideoFromCache = function() {
//        console.log('manual redraw selected video from cache')
//        Playlist.prototype.listenSelectedVideo.call(this, this.id + '_selected', 'manual redraw selected video from cache')
//    }

    Playlist.prototype.setId = function (id, manualRedraw) {
        $.jStorage.stopListening(id, this.listenRedrawPlaylistFromCache)
        $.jStorage.stopListening(id + '_selected', this.listenPlaySelectedVideo)
        this.id = id
        if (manualRedraw) {
            Playlist.prototype.manualRedrawPlaylistFromCache.call(this, id, 'manual redraw from cache')
        }
        $.jStorage.listenKeyChange(id, this.listenRedrawPlaylistFromCache.bind(this))
        $.jStorage.listenKeyChange(id + '_selected', this.listenPlaySelectedVideo.bind(this))
    }

    this.recalculatePlaylist = function (dontCache) {
        _.defer(function () {
            this.immediateRecalculatePlaylist.call(this, dontCache)
        }.bind(this))
    }

    this.immediateRecalculatePlaylist = function (dontCache) {
        this.options && typeof this.options.debounceRecalculatePlaylistCallback == "function" && this.options.debounceRecalculatePlaylistCallback()

        this.playlist = this.jPlaylist.find(">div.pti-element-song").filter(function (index, item) {
            item = $(item)
            return item
        })
        this.recalculateSortableArray()

        if (!dontCache && this.id) {
            console.log('setting to storage')
            var storagePlaylist = {source:this.uid, data:this.getPlaylist()}
            $.jStorage.set(this.id, storagePlaylist)
        }
    }

    this.debounceRecalculatePlaylist = _.debounce(function (dontCache) {
        this.recalculatePlaylist(dontCache);
    }, 50)

    Playlist.prototype.playlistVideos = function () {
        return _.map(this.playlist, function (item) {
            return $(item).data('videoFeed')
        })
    }

    Playlist.prototype.buildHash = function () {
        return "#" + this.sortableArray
    }

    Playlist.prototype.lookupNextSong = function () {
        var index = this.playlist.index(this.jPlaylist.find('div.selected'))
        index = index >= this.playlist.length - 1 ? 0 : ++index
        return this.playlist[index]
    }

    this.addCalendarSongsToPlaylist = function (groups) {
        var hideGroupContentsHandler = this.hideGroupContents.bind(this)
        groups.forEach(function (group) {
            console.log(group.name)
            var element = $(Playlist.prototype.groupHeaderTemplate(group)).click(function () {
                hideGroupContentsHandler(element)
            })
            this.jPlaylist.append(element)
            group.links.forEach(function (videoFeed) {
//                console.log(videoFeed)
                var videoElement = new VideoElement(videoFeed, this.jPlaylist)
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

    this.addSongsToPlaylist = function (links, unique, loadVideoFeedCallback, dontCache) {
        if (unique == true) {
            var oldLinks = this.parseSongIds(this.jPlaylist.sortable('toArray').join(','))
            links = _.filter(links, function (newSong) {
                return !_.findWhere(oldLinks, newSong)
            })
        }

        links = _.filter(links, function (validSong) {
            return (validSong.id && validSong.type)
        })

        if (typeof loadVideoFeedCallback == "function") {
            var afterLoadVideoFeed = _.after(links.length, loadVideoFeedCallback)
        }

        links.forEach(function (videoFeed) {
            var videoElement = new VideoElement(videoFeed, this.jPlaylist)
            var linkContext = {
                videoElement:videoElement,
                videoFeed:videoFeed,
                retryCounter:0,
                loadVideoFeedCallback:afterLoadVideoFeed
            }
            siteHandlerManager.loadVideoFeed(linkContext)
            this.debounceRecalculatePlaylist(dontCache)
        }.bind(this))
    }

    Playlist.prototype.parseSongIds = function (text) {
        return text.replace(/.*#/, '').split(',').map(function (item) {
            return {type:item.replace(/=.*/, ''), id:item.replace(/.*=/, '')}
        })
    }

    Playlist.prototype.recalculateSortableArray = function () {
        this.sortableArray = this.jPlaylist.sortable('toArray')
        return this.sortableArray
    }
    function setWindowTitle(videoFeed) {
        typeof windowId != "undefined" && (document.title = windowId + ' - ' + videoFeed.title)
    }

    Playlist.prototype.playVideo = function (video, playerState, dontCache) {
        var videoObject = Playlist.prototype.getVideoDivAndFeed.call(this, video)
        this.selectVideo(videoObject, dontCache)
        if (this.options && !this.options.dontPlay) {
            SiteHandlerManager.prototype.playVideoFeed(this.currVideoFeed, playerState)
        } else {
            console.log('not a player type')
        }
    }

    Playlist.prototype.playerType = function (boolean) {
        if (typeof boolean == "undefined") {
            return !this.options.dontPlay
        }
        if (boolean) {
            this.options.dontPlay = false
        } else {
            this.options.dontPlay = true
        }
        return !this.options.dontPlay
    }

    Playlist.prototype.playNextVideo = function () {
        playlist.playVideo({videoDiv:playlist.lookupNextSong()})
    }

    Playlist.prototype.getSelectedVideoDiv = function () {
        this.currVideoDiv = this.jPlaylist.find('.selected')[0]
        return this.currVideoDiv
    }

    Playlist.prototype.getSelectedVideoFeed = function () {
        this.currVideoFeed = $(this.getSelectedVideoDiv()).data('videoFeed')
        return this.currVideoFeed
    }

    Playlist.prototype.getVideoDivAndFeed = function (video) {
        var videoDiv
        var videoFeed
        if (video && video.videoDiv && video.videoFeed) {
            return video
        }
        if (video && video.videoDiv) {
            videoDiv = video.videoDiv
            videoFeed = $(videoDiv).data('videoFeed')
        } else if (video && video.videoFeed) {
            videoFeed = video.videoFeed
            videoDiv = this.jPlaylist.find(Playlist.prototype.concatId(videoFeed.type, videoFeed.id))
        }
        if (!videoFeed) {
            throw "videoFeed or video is empty in getVideoDivAndFeed"
        }
        return {videoFeed:videoFeed, videoDiv:videoDiv}
    }

    Playlist.prototype.selectVideo = function (video, properties) {
//        if(video && (video.videoDiv || video.videoFeed)) {
        if (this.playlist) {
            this.playlist.removeClass("selected")
        }
        var videoObject = Playlist.prototype.getVideoDivAndFeed.call(this, video)
        var videoFeed = videoObject.videoFeed
        var videoDiv = videoObject.videoDiv
        this.currVideoFeed = videoFeed
        this.currVideoDiv = videoDiv
        $(this.currVideoDiv).addClass("selected")
        if (this.id && !(properties && properties.dontCache)) {
            console.log('setting currVideoFeed to storage')
            $.jStorage.set(this.id + '_selected', { source:this.uid, data:this.currVideoFeed, date: new Date().getTime()})
        }
        setWindowTitle(this.currVideoFeed);
    }

    Playlist.prototype.concatId = function (first, second) {
        var concated
        if (first && second) {
            concated = first + "=" + second
        } else if (first) {
            concated = first
        } else {
            throw "escapeURL called with empty or null parameters"
        }
        concated = Playlist.prototype.escapeSelector(concated)
        return concated.replace(/^#?(.*)$/, '#$1')
    }

    Playlist.prototype.escapeSelector = function(str) {
        if( str)
            return str.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g,'\\$1')
        else
            return str;
    }

    Playlist.prototype.getPlaylist = function () {
        return this.sortableArray
    }

    this.jPlaylist.on('click', '.pti-element-song .image-div', function () {
//        console.log(this)
        var ptiSong = $(this).parent().parent()
        Playlist.prototype.playVideo.call(self, {videoDiv:$(ptiSong)})
    })

    Playlist.prototype.setSlimScroll = function (element, height) {
        $(element).slimScroll({
            height:height,
            color:'rgb(0, 50, 255)',
            railVisible:true,
            railColor:'#000000',
            disableFadeOut:true
        });
    }

    Playlist.prototype.setSlimScroll(this.jPlaylist, "100%")

    if (options && options.id) {
        this.setId(options.id, options.redraw)
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

function formatDate(dateObj) {
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var newdate = ("0" + day).slice(-2) + "-" + ("0" + month).slice(-2) + "-" + year;
    return newdate
}

function calendarSorted(callback) {
    $.ajax({url:'/calendarSorted?start=0', success:function (data) {
//        console.log(data)
        window.calendarData = data
        typeof callback == "function" && callback(data)
    }})
}

var reduce = function (sortedData) {
    return _.flatten(_.reduce(sortedData, function (memo, item) {
        _.each(item.data, function (item) {
            item.date = this.meta.date
            item.url = this.meta.url
        }, item)
        memo.push(item.data);
        return memo
    }, new Array()))
}
var groupByDate = function (links) {
    return _.groupBy(links, function (item) {
        return formatDate(new Date(item.date))
    })
}
var groupByUrl = function (links) {
    return _.groupBy(links, function (item) {
        return item.url.replace(/(.*\/\/)?(www.)?([^\/]+).*/, '$3')
    })
}


var map = function (grouped) {
    return _.map(grouped, function (item) {
        return {'name':item[0], links:_.uniq(item[1], function (item) {
            return item.id + item.type
        })}
    })
}

