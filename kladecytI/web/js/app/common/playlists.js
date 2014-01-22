define(function () {
    var Playlists, firstPlaylists, playlists, firstPlaylistsDefinition, secondPlaylistsDefinition, playlistsDefinitionsObject, playlistsHandler
    var init = _.once(function(Playlists) {
        firstPlaylistsDefinition = {
            init: _.once(function () {
                firstPlaylists = new Playlists("#ulFirstPlaylists")
            }),
            getPlaylists: function () {
                return firstPlaylists
            }
        }
        secondPlaylistsDefinition = {
            init: _.once(function () {
                playlists = new Playlists("#ulSecondPlaylists")
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
        $('#secondViewTabs').tabs('option', 'active', 1)
        init(PlaylistsRequire)
        secondPlaylistsDefinition.init()
        window.playlists = playlists
        window.firstPlaylists = firstPlaylists
    })
    //remove

    $('#tabs a[href="#firstPlaylistsDiv"], #secondViewTabs a[href="#secondPlaylistsDiv"]').click(function () {
        var clickedNav = this
        require(["common/playlists"], function (PlaylistsRequire) {
            init(PlaylistsRequire)
            playlistsHandler($(clickedNav).attr('href').replace(/#/g, ""))
        })
    })

})