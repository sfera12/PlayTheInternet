

var gimpedAnimation = [
    {nav:"#player", fixed:"#podPlayer"},
    {nav:"#tAreaDiv", fixed:"#podTa"},
    {nav:"#optionsDiv", fixed:"#podOptions"},
    {nav:"#recycleBinDiv", fixed:"#podBin"}
]

fc = 220

$.each(gimpedAnimation, function (index, item) {
    var rgb = function (number) {
        console.log(number)
        return 'rgb(' + number + ', ' + number + ', ' + number + ')'
    }
    $('a[href="' + item.nav + '"]').mouseenter(function (event, ui) {
        $(item.fixed).animate({height:"100%"}, { queue:false, duration:500})
    }).mouseleave(function (event, ui) {
            $(item.fixed).animate({
                height:"0%"
            }, 600, 'linear', function () {
                $('a[href="' + item.nav + '"]').removeClass('post-hover')
            });
            $(item.fixed).addClass('post-hover')
            $('a[href="' + item.nav + '"]').addClass('post-hover')
        });
})

$(document).ready(function () {
    window.windowId = GUID()
    $.jStorage.subscribe('queryWindowIds', function (message) {
//        console.log(message)
        $.jStorage.publish('windowIds', windowId)
    })
//    var yt1 = new YoutubePlayer(null, new Playlist("#ulFirst"))
    $.jStorage.set(windowId, {data:window.location.hash.replace(/.*#(.*)/, '$1').split(',')})
    window.ulFirst = new Playlist('#ulFirst')
    window.calendarPlaylist = new Playlist('#calendarPlaylist', {type:'calendar'})
    window.playlist = new Playlist("#ulSecond",
        {
            id:windowId,
            listenKeyChangeCallback:function (playlist) {
                window.location.hash = playlist.jPlaylist.sortable('toArray')
                $('#qrcode').empty()
                try {
                    $('#qrcode').qrcode(window.location.href)
                } catch (e) {
                    console.log(e)
                }
            },
            debounceRecalculatePlaylistCallback: _.once(function() {
                console.log('playFirstLoaded debounce')
                playFirstLoaded()
            })
        });
    playlist.addSongsToPlaylist(playlist.parseSongIds(window.location.hash), true)

    setSlimScroll(calendarPlaylist.jPlaylist, "100%")
    setSlimScroll(ulFirst.jPlaylist, "100%")
    setSlimScroll(playlist.jPlaylist, "100%")
    setSlimScroll(parsedPlaylist.jPlaylist, '100%')
    $('.datepicker').datepicker()
    $('#searchCalendar').click(function (evt) {
        propagateCalendar()
    })
    $('#tAreaParseButton').click(function () {
        var tAreaText = $('#tArea').val()
        playlist.addSongsToPlaylist(playlist.parseSongIds(playTheInternetParse(tAreaText)), true)
    })
    $('#buildHash').click(function () {
        $('#buildHashInput').val(window.location.origin + '/display-grid.html' + playlist.buildHash())
    })
    $('#renameWindow').click(function () {
        var renameWindowInputVal = $('#renameWindowInput').val();
        if (renameWindowInputVal.length > 0) {
            document.title = document.title.replace(windowId, renameWindowInputVal)
            windowId = renameWindowInputVal
        }
    })

    if (window.location.hash.length == 0) {
        $("#tabs").tabs("option", "active", 1);
    }
    var filterThrottle = _.throttle(function () {
        matchTitleRegExp = new RegExp($('#calendarFilterTitle').val(), "gi")
        filterDurationMoreValue = $('#calendarFilterDurationMore').val()
        filterDurationLessValue = $('#calendarFilterDurationLess').val()
        select()
    }, 1500)
    $('#calendarFilter').keyup(filterThrottle)

    document.title = windowId
    SoundCloudHandler.prototype.initializePlayer();
})

function propagateCalendar() {
    var dateRange = ""
    if ($('#calendarStart').val()) {
        dateRange += "start=" + DPGlobal.parseDate($('#calendarStart').val(), DPGlobal.parseFormat('dd-mm-yyyy')).getTime() + "&"
    }
    if ($('#calendarEnd').val()) {
        dateRange += "end=" + (DPGlobal.parseDate($('#calendarEnd').val(), DPGlobal.parseFormat('dd-mm-yyyy')).getTime() + 86399999)
    }
    console.log(dateRange)
    $.ajax({
        url:'/calendarSorted?' + dateRange,
        success:function (data) {
//                var uniqSongs = _.uniq(_.flatten(_.reduce(data, function (memo, item) {
//                    memo.push(item.data);
//                    return memo
//                }, new Array())), function (item) {
//                    return item.type + '=' + item.id
//                })
////                console.log(uniqSongs)
//                var compose = _.compose(map, _.pairs, groupByDate, reduce)
            var compose = _.compose(map, _.pairs, groupByUrl, reduce)
            var calendarDays = compose(data)
            calendarPlaylist.jPlaylist.empty()
            calendarPlaylist.addCalendarSongsToPlaylist(calendarDays)
        }
    })
}

var tabsPlayerContainer = $('#tabs .tabs-player-container')
$('#tabs').tabs({
    activate:function (event, ui) {
        var newTab = $(ui.newTab);
//        console.log(newTab.text())
//            if(newTab.text() == "Calendar") {
//                propagateCalendar()
//            }
            if(newTab.text() == "Player") {
                tabsPlayerContainer.removeClass('leftFull')
                tabsPlayerContainer.addClass('tabs-player-container')
            } else {
                tabsPlayerContainer.addClass('leftFull')
                tabsPlayerContainer.removeClass('tabs-player-container')
            }
        newTab.addClass('active')
        $(ui.oldTab).removeClass('active')
    }
})
$($('#tabs>ul>li[aria-controls="parsedDiv"]')).css('display', 'none');

var matchTitleRegExp
var matchText = function (node) {
    return $(node).text().match(matchTitleRegExp) != null ? true : false
}
var selectMatched = function (node, matchNode) {
    var jNode = $(node)
    if (matchNode(node)) {
        calendarPlaylist.jPlaylist.append(jNode)
        jNode.addClass('ui-selected')
    } else {
        jNode.removeClass('ui-selected')
    }
}
var select = function () {
    calendarPlaylist.jPlaylist.find('>*').remove(null, true)
    _.each(calendarPlaylist.playlist, function (item) {
        selectMatched(item, filters)
    })
}

var filters = function (node) {
    var result = true
    if (result && matchTitleRegExp.toString() != "\"/(?:)/gi\"") {
        result = filterTitle(node)
    }
    if (result && filterDurationMoreValue != "NaN") {
        result = filterDurationMore(node)
    }
    if (result && filterDurationLessValue > 0 && filterDurationLessValue != "NaN") {
        result = filterDurationLess(node)
    }
    return result
}

var filterTitle = function (node) {
    node = $(node)
    var data = node.data('videoFeed')
    var title = data.title || data.id
    return title.match(matchTitleRegExp) ? true : false
}
var filterDurationMore = function (node) {
    node = $(node)
    var data = node.data('videoFeed')
    if (data.duration == undefined) {
        return true
    }
    return data && data.duration && data.duration >= filterDurationMoreValue ? true : false
}
var filterDurationLess = function (node) {
    node = $(node)
    var data = node.data('videoFeed')
    if (data.duration == undefined) {
        return true
    }
    return data && data.duration && data.duration <= filterDurationLessValue ? true : false
}
window.regEx = /(((\d+)([d:\s]*))?((\d+)([h:\s]*))?)?((\d+)([m:\s]*))?(\d+)([s\s]*)/
var stringToSeconds = function (string) {
    var result = string.match(regEx)
//    console.log(result)
    if (result) {
        var day = result[2] != undefined ? Number(result[2]) : 0
        var hour = result[5] != undefined ? Number(result[5]) : 0
        var minutes = result[8] != undefined ? Number(result[8]) : 0
        var seconds = result[10] != undefined ? Number(result[10]) : 0
        console.log({day:day, hour:hour, minutes:minutes, seconds:seconds})
        return day * 86400 + hour * 3600 + minutes * 60 + seconds
    } else {
        return 0
    }
}