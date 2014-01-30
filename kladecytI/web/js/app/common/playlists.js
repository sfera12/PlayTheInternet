define(function () {
    var Playlists, firstPlaylists, playlists, firstPlaylistsDefinition, secondPlaylistsDefinition, playlistsDefinitionsObject, playlistsHandler, firstPlaylistsPlaylistHeaderOptions, secondPlaylistsPlaylistHeaderOptions
    var init = _.once(function(Playlists, extension) {
        firstPlaylistsDefinition = {
            init: _.once(function () {
                firstPlaylists = new Playlists("#ulFirstPlaylists", {
                    playlistElementSize: firstPlaylistsPlaylistHeaderOptions.size,
                    playlistElementSplit: firstPlaylistsPlaylistHeaderOptions.split,
                    playlistHeaderClick: extension.headerClick.bind({firstPlaylistsPlaylistHeaderOptions: {}})
                })
            }),
            getPlaylists: function () {
                return firstPlaylists
            }
        }
        secondPlaylistsDefinition = {
            init: _.once(function () {
                playlists = new Playlists("#ulSecondPlaylists", {
                    playlistElementSize: secondPlaylistsPlaylistHeaderOptions.size,
                    playlistElementSplit: secondPlaylistsPlaylistHeaderOptions.split,
                    playlistHeaderClick: extension.headerClick.bind({secondPlaylistsPlaylistHeaderOptions: {}})
                })
            }),
            getPlaylists: function () {
                return playlists
            }
        }
        playlistsDefinitionsObject = {
            firstPlaylistsDiv: firstPlaylistsDefinition,
            secondPlaylistsDiv: secondPlaylistsDefinition
        }

        playlistsHandler = function (href) {
            var playlistsDefinition = playlistsDefinitionsObject[href]
            playlistsDefinition.init()
            playlistsDefinition.getPlaylists().playlistClose()
        }
    })

    //remove
    require(["app/common/tabs", "common/playlists"], function (asdf, PlaylistsRequire) {
        chrome.storage.local.get(function (options) {
            firstPlaylistsPlaylistHeaderOptions = _.default(options.firstPlaylistsPlaylistHeaderOptions, { size: 'medium', split: 'one'})
            secondPlaylistsPlaylistHeaderOptions = _.default(options.secondPlaylistsPlaylistHeaderOptions, { size: 'medium', split: 'one'})
        })
//        $('#secondViewTabs').tabs('option', 'active', 1)
//        init(PlaylistsRequire)
//        secondPlaylistsDefinition.init()
//        window.playlists = playlists
//        window.firstPlaylists = firstPlaylists
    })
    //remove

    $('#tabs a[href="#firstPlaylistsDiv"], #secondViewTabs a[href="#secondPlaylistsDiv"]').click(function () {
        var clickedNav = this
        require(["common/playlists", "app/chrome/extension"], function (PlaylistsRequire, extensionRequire) {
            init(PlaylistsRequire, extensionRequire)
            playlistsHandler($(clickedNav).attr('href').replace(/#/g, ""))
        })
    })

})