define(['jquery', 'jquery-ui'], function ($) {
    window.tabs = { first: {}, second: {} }

//FIRST CREATE TABS START
    $('#tabs').tabs({
        activate: function (event, ui) {
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
            if (newTab.text() == "Playlists") {
                initFirstPlaylistsClickHandlers()
            }
        }
    })

//first player start
    var tabsPlayerContainer = $('#tabs .tabs-player-container')
//first player end

//first options start
    $('#LOUD').click(function () {
        chrome.extension.getBackgroundPage().pti.volume(100)
        pti.volume(100)
    })
//first options end

//first playlists start
    $('#tabs').on('click', 'ul>li>a', function() {
        tabs.first.playlist = null
    })
    $('#firstView').on('click', '[href="#tAreaDiv"]', function () {
        tabs.first.playlist = typeof textParsePlaylist !== "undefined" ? textParsePlaylist : null
    })
    $('#firstView').on('click', '#tAreaParseButton', function () {
        tabs.first.playlist = textParsePlaylist
    })
    $('#firstView').on('click', '[href="#parsedDiv"]', function () {
        tabs.first.playlist = parsedPlaylist
    })
    tabs.first.getPlaylist = function () {
        return tabs.first.playlist ? tabs.first.playlist : tabs.second.playing
    }
    var initFirstPlaylistsClickHandlers = _.once(function () {
        $('#tabs').on('click', '.ui-tabs-active>a[href="#firstPlaylistsDiv"]', selectFirstPlaylists) //selectFirstPlaylists will run
        $('#ulFirstPlaylists').on('click', '.image-div', function () {
            tabs.first.playlist = tabs.first.playlists.playlist
        })
    })
    var selectFirstPlaylists = function () {
        require(["common/playlists"], function(Playlists) {
            initFirstPlaylists(Playlists).playlistClose()
        })
    }
    var initFirstPlaylists = _.once(function(Playlists) {
        tabs.first.playlists = new Playlists("#ulFirstPlaylists", {
            playlistHeaderConfigKey: "lConfigFirstPlaylistsPlaylistHeader",
            playlistTabsGetPlaylist: function () {
                this.tabsGetPlaylist = tabs.second.getPlaylist
            }
        })
        window.playlists = tabs.first.playlists //can remove this
        return tabs.first.playlists
    })
//first playlists end
//FIRST CREATE TABS END

//SECOND CREATE TABS START
    var $secondTabs = $('#secondViewTabs').tabs({
        active: -1,
        activate: function (event, ui) {
            var newTab = $(ui.newTab);
            if (newTab.text() == "Playing") {
                require(["app/common/hash-qr", "pti-playlist"], function (redrawHashAndQRCode, Playlist) {
                    tabs.second.playing = tabs.second.playlist = initPlaying(redrawHashAndQRCode, Playlist)
                })
            }
            if (newTab.text() == "Playlists") {
                initSecondPlaylistsClickHandlers()
            }
        }
    })

//second playing start
    var initPlaying = _.once(function (redrawHashAndQRCode, Playlist) {
        var selected = $.jStorage.get("selected_backgroundPageId"), index = selected && selected.index >= 0 && selected.index
        tabs.second.playing = new Playlist("#ulSecond", {
                id: chrome.extension.getBackgroundPage().windowId,
                scrollTo: index,
                recalculateJContentImmediateCallback: redrawHashAndQRCode,
                connectWith: "connected-playlist",
                headerConfigKey: "lConfigPlaylistHeader",
                execute: [
                    Playlist.prototype.playAction
                ]
            }
        )
        window.playlist = tabs.second.playing //can remove this
        return tabs.second.playing
    })
//second playing end

//second playlists start
    $('#secondViewTabs').on('click', 'ul>li>a', function() {
        tabs.second.playlist = null
    })
    tabs.second.getPlaylist = function () {
        return tabs.second.playlist ? tabs.second.playlist : tabs.second.playing
    }
    var initSecondPlaylistsClickHandlers = _.once(function () {
        $('#secondViewTabs').on('click', '.ui-tabs-active>a[href="#secondPlaylistsDiv"]', selectSecondPlaylists) //selectSecondPlaylists will run
        $('#ulSecondPlaylists').on('click', '.image-div', function () {
            tabs.second.playlist = tabs.second.playlists.playlist
        })
    })
    var selectSecondPlaylists = function () {
        require(["common/playlists"], function(Playlists) {
            initSecondPlaylists(Playlists).playlistClose()
        })
    }
    var initSecondPlaylists = _.once(function(Playlists) {
        tabs.second.playlists = new Playlists("#ulSecondPlaylists", {
            playlistHeaderConfigKey: "lConfigSecondPlaylistsPlaylistHeader",
            playlistTabsGetPlaylist: function () {
                this.tabsGetPlaylist = tabs.first.getPlaylist
            }
        })
        window.playlists = tabs.second.playlists //can remove this
        return tabs.second.playlists
    })
//second playlists end
//SECOND CREATE TABS END

    $secondTabs.tabs("option", 'active', 0)
})
