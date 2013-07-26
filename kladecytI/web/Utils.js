function VideoElement(videoFeed, appendTo) {
    var div

    this.createDiv = function (videoFeed) {
        var childDiv = $('<div/>')
        this.div = $('<div/>').append(childDiv)
        this.div.addClass('pti-state-default')
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
    Playlist.prototype.groupHeaderTemplate = _.template('<label class="pti-state-droppable-target"><%=name%></label>')
    this.options = options
    this.containerElementExpression = appendToElementExpression
    this.jPlaylist = $(this.containerElementExpression)
    this.sortableArray = new Array()
    this.playlist
    this.currSong
    this.id
    this.first_rows = {}
    this.blockSort = false

    Playlist.prototype.hideGroupContents = function(element) {
        var headerTagName = element[0].tagName;
        var headers = this.jPlaylist.find(headerTagName)
        var headerIndex = headers.index(element)
        var playlistElements = calendarPlaylist.jPlaylist.find('>*')
        var childStartIndex = playlistElements.index(element) + 1;
        var childEndIndex = 9999
        if(!(headerIndex == headers.length - 1)) {
            childEndIndex = playlistElements.index(headers[headerIndex + 1])
        }
        this.jPlaylist.find('>*').slice(childStartIndex, childEndIndex).toggleClass('display-none')
//        console.log(headerTagName); console.log(headers); console.log(headerIndex); console.log(childStartIndex); console.log(childEndIndex)
    }

    this.jPlaylist.data('playlist', this)
    if(this.options && this.options.type && this.options.type=='calendar') {
        this.jPlaylist.addClass('calendar')
    }
    this.jPlaylist.selectable({
        filter: 'div.pti-state-default',
        cancel: 'div.image-div, label.pti-state-droppable-target'
    })
        .sortable({
            connectWith:'.connectedSortable',
            scrollSensitivity:50,
            tolerance:'pointer',
            distance:25,
            handle: 'div.image-div',
            placeholder: 'ui-state-highlight',
//            update:function (event, ui) {
//                this.recalculatePlaylist()
//            }.bind(this),
            cancel:'.pti-state-droppable-target',
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
        start: function(event, ui) {
            $('.cloned').removeClass('cloned')
            if(options && options.type == 'calendar') {
                this.blockSort = true
            }
            console.log('start')
            console.log(this)
            if (ui.item.hasClass('ui-selected') && this.jPlaylist.find('.ui-selected').length > 1) {
                this.first_rows = this.jPlaylist.find('.ui-selected').map(function(i, e) {
                    var $tr = $(e);
                    return {
                        tr : $tr.clone(true),
                        id : $tr.attr('id')
                    };
                }).get();
                this.jPlaylist.find('.ui-selected').addClass('cloned');
            }
            ui.placeholder.html('<td class="pti-state-default">&nbsp;</td>');
        }.bind(this),
        stop: function(event, ui) {
            console.log('stop')
            console.log(this)
            if(this.blockSort) {
                console.log('preventDefault')
                event.preventDefault()
            } else {
                console.log('preventDefaultElse')
                var targetParent = ui.item.parent().data('playlist')
                console.log(targetParent)
                console.log(this.first_rows)
                if (this.first_rows.length > 1) {
                    $.each(this.first_rows, function(i, item) {
                        console.log($(item.tr).removeAttr('style').insertBefore(ui.item))
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
        remove: function(event, ui) {
            console.log('remove')
            console.log(this)
            this.blockSort = false
        }.bind(this)
//        ,receive: function(event, ui) {
//            _.defer(function () {
//                this.recalculatePlaylist()
//            }.bind(this))
//        }.bind(this)
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

    Playlist.prototype.listenFunction = function(key, action) {
        this.recalculateSortable()
        console.log(key + ' has been ' + action)
        console.log(this.sortableArray)
        console.log($.jStorage.get(key))
        arrayEq = function(a, b) {
            return _.all(_.zip(a, b), function(x) {
                return x[0] === x[1];
            });
        };
        if(arrayEq(this.sortableArray, $.jStorage.get(key))) {
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
        _.defer(this.immediateRecalculatePlaylist.bind(this))
    }

    this.immediateRecalculatePlaylist = function() {
        this.playlist = this.jPlaylist.find(">div.pti-state-default").filter(function (index, item) {
            item = $(item)
            return item
        })
        this.recalculateSortable()

        if (this.id) {
            $.jStorage.set(this.id, this.sortableArray)
        }
    }

    this.debounceRecalculatePlaylist = _.debounce(function () {
        this.recalculatePlaylist();
        console.log('playFirstLoaded debounce')
        if(typeof playFirstLoaded == "function") {
            playFirstLoaded();
        }
    }, 50)

    Playlist.prototype.playlistVideos = function() {
        return _.map(this.playlist, function(item) { return $(item).data('videoFeed') })
    }

    Playlist.prototype.buildHash = function () {
        return "#" + this.prototype.sortable()
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
            var element = $(Playlist.prototype.groupHeaderTemplate(group)).click(function() {hideGroupContentsHandler(element)})
            this.jPlaylist.append(element)
            group.links.forEach(function (videoFeed) {
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

    Playlist.prototype.recalculateSortable = function() {
        this.sortableArray = this.jPlaylist.sortable('toArray')
        return this.sortableArray
    }

    Playlist.prototype.playVideoDiv = function (videoDiv) {
        var videoFeed = $(videoDiv).data('videoFeed')
        if (videoFeed) {
            this.playlist.removeClass("selected")
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
    var month = dateObj.getUTCMonth() + 1;
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