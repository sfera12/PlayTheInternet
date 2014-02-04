define(['jquery', 'jquery-ui'], function ($) {
    var tabsPlayerContainer = $('#tabs .tabs-player-container')
    window.tabs = { first: {}, second: {} }
    $('#tabs').tabs({
        activate:function (event, ui) {
            var newTab = $(ui.newTab);
            if (newTab.text() == "Options") {
                require(["app/common/hash-qr"], function (redraw) {
                    redraw()
                })
            }
            //        console.log(newTab.text())
            //            if(newTab.text() == "Calendar") {
            //                propagateCalendar()
            //            }
            if (newTab.text() == "Player") {
                tabsPlayerContainer.removeClass('temp-absolute-off-scren')
                tabsPlayerContainer.addClass('tabs-player-container')
            } else {
                tabsPlayerContainer.addClass('temp-absolute-off-scren')
                tabsPlayerContainer.removeClass('tabs-player-container')
            }
            newTab.addClass('active')
            $(ui.oldTab).removeClass('active')
        }
    })
    tabs.first.getPlaylist = function() {
        return tabs.first.playlist ? tabs.first.playlist : parsedPlaylist
    }
    $('#tabs').on('click', 'ul>li>a', function() {
        tabs.first.playlist = window.playlist
    })
    $('#firstView').on('click', '[href="#tAreaDiv"]', function() {
        tabs.first.playlist = typeof textParsePlaylist !== "undefined" ? textParsePlaylist : window.playlist
    })
    $('#firstView').on('click', '#tAreaParseButton', function() {
        tabs.first.playlist = textParsePlaylist
    })
    $('#firstView').on('click', '[href="#parsedDiv"]', function() {
        tabs.first.playlist = parsedPlaylist
    })
    $('#ulFirstPlaylists').on('click', '.image-div', function() {
        tabs.first.playlist = firstPlaylists.playlist
    })

    $('#secondViewTabs').tabs({
    })
    var secondPlaylist = null
    tabs.second.getPlaylist = function() {
        return secondPlaylist ? secondPlaylist : window.playlist
    }
    $('#secondViewTabs').on('click', 'ul>li>a', function() {
        secondPlaylist = window.playlist
    })
    $('#ulSecondPlaylists').on('click', '.image-div', function() {
        secondPlaylist = playlists.playlist
    })
})
