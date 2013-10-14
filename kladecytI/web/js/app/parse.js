define(['playlist', 'jquery'], function(a, $) {
    function calendarSortedStringify(callback) {
        $.ajax({url:'/calendarSorted', success:function (data) {
            console.log(JSON.stringify(data))
            typeof callback == "function" && callback(data)
        }})
    }

    function calendarSorted(callback) {
        $.ajax({url:'/calendarSorted', success:function (data) {
            console.log(data)
            typeof callback == "function" && callback(data)
        }})
    }


    var pll = new Playlist("#ulFirst", {dontPlay:true})
    var plr = new Playlist('#ulSecond', {dontPlay:true});
    var saveToHistory = _.once(function () {
        var now = new Date().getTime();
        var user = 'sichain'
        var data = new Object();
        pll.immediateRecalculatePlaylist()
        data.data = pll.playlistVideos()
        var count = data.data.length
        data.meta = {user:user, url:window.location.href.replace(/.*\?location=([^#]+).*/, '$1'), date:now}
        console.log(JSON.stringify(data))
        $.ajax({
            url:'/calendar?date=' + now + '&user=' + user,
            type:'post',
            data:JSON.stringify(data),
            success:function () {
                var saveHistoryElement = $('#saveHistoryStatus');
                saveHistoryElement.text(count)
                saveHistoryElement.css('font-size', 25)
                saveHistoryElement.css('background-color', 'green')
            },
            error:function (err) {
                console.log(err)
                alert('error in saving to history, please check console for further information')
            }
        })
    }.bind(this))
    pll.addSongsToPlaylist(pll.parseSongIds(window.location.hash), true, saveToHistory, true)

    var ctrlFirst = $('#ctrlFirst')
    var ctrlSecond = $('#ctrlSecond')
    var videos = function (elementExpression) {
        return $(elementExpression + " > div").map(function (index, div) {
            return $(div).data("videoFeed")
        }).map(function (index, item) {
            return {type:item.type, id:item.id }
        }).toArray()
    }
    var videoIds = function (playlist) {
        return playlist.sortableArray
    }

    var generateHref = function (elementExpression, playlist) {
        var proceed = $(elementExpression)
        proceed.attr("target", "_blank")
        proceed.css("font-size", "medium")
        proceed.click(function () {
            proceed.attr("href", "/play.html#" + videoIds(playlist))
            setTimeout(function () {
                window.close()
            }, 10000)
        })
    }
    $(document).ready(function () {

        var drawSelectDifferences = function (ctrl, firstPlt, secondPlt) {
            var input = $('<input type="button"/>')
            input.val('Select differences')
            ctrl.append(input)
            input.click(function () {
                selectDifferences(firstPlt, secondPlt)
            })
        }

        var selectDifferences = function (firstPlt, secondPlt) {
            var differences = _.difference(firstPlt.sortable('toArray'), secondPlt.sortable('toArray'))
            firstPlt.find('>div').removeClass('ui-selected')
            _.each(differences, function (item) {
                firstPlt.find('#' + item.replace(/([=/])/g, '\\$1')).addClass('ui-selected')
            })
        }

        var drawPlaylist = function (plt, ctrl, playlistName, lReturnPlaylist) {
            var input = $('<input type="button"/>')
            input.val(playlistName)
            input.click(function () {
                console.log(plt.jPlaylist)
                plt.setId(playlistName, true)
            })
            ctrl.append(input)
        }

        $.jStorage.subscribe('windowIds', function (channel, payload) {
//            console.log($.jStorage.get(payload))
            if (!($('input[value=' + payload + ']').size())) {
                var returnPlaylist = function () {
                    console.log(payload)
                    return $.jStorage.get(payload).join(',')
                }
                drawPlaylist(pll, ctrlFirst, payload, returnPlaylist)
                drawPlaylist(plr, ctrlSecond, payload, returnPlaylist)
            }
        })

        drawSelectDifferences(ctrlFirst, pll.jPlaylist, plr.jPlaylist)
        drawSelectDifferences(ctrlSecond, plr.jPlaylist, pll.jPlaylist)

        drawPlaylist(pll, ctrlFirst, 'parsed', function () {
            return window.location.hash
        })

        $.jStorage.publish('queryWindowIds', 'give me');
        setInterval(function () {
            $.jStorage.publish('queryWindowIds', 'give me');
        }, 3000)

        generateHref("#nwWndFirst", pll)
        generateHref("#nwWndSecond", plr)
    })
})
