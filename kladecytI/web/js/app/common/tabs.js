define(['jquery', 'jquery-jobbing'], function () {
//GENERIC START
    window.tabs = { first: {}, second: {} }

    function playlistsFactory($nav, $playlistsEl, jStorageType, headerConfigKey, tabs, getPlaylist) {
        var initPlaylists = _.once(function (Playlists) {
            tabs[jStorageType] = new Playlists($playlistsEl, {
                jStorageType: jStorageType,
                playlistHeaderConfigKey: headerConfigKey,
                playlistTabsGetPlaylist: function () {
                    this.tabsGetPlaylist = getPlaylist
                }
            })
            return tabs[jStorageType]
        })
        var selectNav = function () {
            require(["common/playlists"], function (Playlists) {
                initPlaylists(Playlists).playlistClose()
            })
        }
        $nav.click(selectNav)
        return selectNav
    }

    function fetchSynch() {
        require(["app/background/synchronization"], function (synchronization) {
            chrome.storage.sync.get(function (sync) {
                var start = Date.now()
                for (var key in sync) {
                    synchronization.syncListenerUpsert(sync, key, start)
                }
            })
        })
    }

//GENERIC END

//FIRST CREATE TABS START
    var $firstTabs = $('#tabs').tabs({
        activate: function (event, ui) {
            var newTab = $(ui.newTab);
            if (newTab.text() == "Options") {
                require(["app/common/hash-qr"], function (redraw) {
                    redraw()
                })
            }
            if (newTab.text() == "Player") {
                tabsPlayerContainer.removeClass('temp-absolute-off-scren')
                tabsPlayerContainer.addClass('tabs-player-container')
            } else {
                tabsPlayerContainer.addClass('temp-absolute-off-scren')
                tabsPlayerContainer.removeClass('tabs-player-container')
            }
            if (newTab.text() == "Playlists") {
            }
            if (newTab.text() == "Synchronized") {
                fetchSynch()
            }
            if (newTab.text() == "Devices(Read Only)") {
                fetchSynch()
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
    $('#tabs').on('click', 'ul>li>a', function () {
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
    $('#ulFirstPlaylists').on('click', '.image-div', function () {
        tabs.first.playlist = tabs.first.playlists.playlist
    })
    $('#ulFirstSynchronized').on('click', '.image-div', function () {
        tabs.first.playlist = tabs.first.synchronized.playlist
    })
    $('#ulFirstDevices').on('click', '.image-div', function () {
        tabs.first.playlist = tabs.first.devices.playlist
    })
    tabs.first.getPlaylist = function () {
        return tabs.first.playlist ? tabs.first.playlist : tabs.second.playing
    }

    var selectFirstPlaylists = playlistsFactory($('a[href="#firstPlaylistsDiv"]'), $("#ulFirstPlaylists"), "playlists", "lConfigFirstPlaylistsPlaylistHeader", window.tabs.first, window.tabs.second.getPlaylist)
    var selectFirstSynchronized = playlistsFactory($('a[href="#firstSynchronizedDiv"]'), $("#ulFirstSynchronized"), "synchronized", "lConfigFirstPlaylistsPlaylistHeader", window.tabs.first, window.tabs.second.getPlaylist)
    var selectFirstDevices = playlistsFactory($('a[href="#firstDevicesDiv"]'), $("#ulFirstDevices"), "devices", "lConfigFirstPlaylistsPlaylistHeader", window.tabs.first, window.tabs.second.getPlaylist)
//first playlists end

//first dropdown start
    $.dropdown($('#playlistsDropdown'), $('#tabs').find('.playlistsDropdown>a'))
    $.dropdown($('#parseDropdown'), $('#tabs').find('.parseDropdown>a'))
    $.dropdown($('#optionsDropdown'), $('#tabs').find('.optionsDropdown>a'))
//first dropdown end

    $firstTabs.tabs("option", "active", 1)
//FIRST CREATE TABS END

//SECOND CREATE TABS START
    var $secondTabs = $('#secondViewTabs').tabs({
        active: -1,
        activate: function (event, ui) {
            var newTab = $(ui.newTab);
            if (newTab.text() == "Playing") {
                require(["app/common/hash-qr", "pti-playlist"], function (redrawHashAndQRCode, Playlist) {
                    tabs.second.playlist = initPlaying(redrawHashAndQRCode, Playlist)
                })
            }
            if (newTab.text() == "Playlists") {
            }
            if (newTab.text() == "Synchronized") {
                fetchSynch()
            }
            if (newTab.text() == "Devices(Read Only)") {
                fetchSynch()
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
    $('#secondViewTabs').on('click', 'ul>li>a', function () {
        tabs.second.playlist = null
    })
    $('#ulSecondPlaylists').on('click', '.image-div', function () {
        tabs.second.playlist = tabs.second.playlists.playlist
    })
    $('#ulSecondSynchronized').on('click', '.image-div', function () {
        tabs.second.playlist = tabs.second.synchronized.playlist
    })
    $('#ulSecondDevices').on('click', '.image-div', function () {
        tabs.second.playlist = tabs.second.devices.playlist
    })
    tabs.second.getPlaylist = function () {
        return tabs.second.playlist ? tabs.second.playlist : tabs.second.playing
    }

    var selectSecondPlaylists = playlistsFactory($('a[href="#secondPlaylistsDiv"]'), $("#ulSecondPlaylists"), "playlists", "lConfigSecondPlaylistsPlaylistHeader", window.tabs.second, window.tabs.first.getPlaylist)
    var selectSecondSynchronizedPlaylists = playlistsFactory($('a[href="#secondSynchronizedDiv"]'), $("#ulSecondSynchronized"), "synchronized", "lConfigSecondPlaylistsPlaylistHeader", window.tabs.second, window.tabs.first.getPlaylist)
    var selectSecondDevicesPlaylists = playlistsFactory($('a[href="#secondDevicesDiv"]'), $("#ulSecondDevices"), "devices", "lConfigSecondPlaylistsPlaylistHeader", window.tabs.second, window.tabs.first.getPlaylist)

//second playlists end
//SECOND CREATE TABS END

    $secondTabs.tabs("option", 'active', 0)
})
