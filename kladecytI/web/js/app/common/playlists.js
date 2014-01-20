define(["common/playlists"], function() {

//    $('#secondViewTabs a[href="#secondPlaylistsDiv"]').click(function () {
        require(["common/playlists"], function(Playlists) {
            window.firstPlaylists = new Playlists("#ulFirstPlaylists", { id: "playlists", listenId: "*", redraw: true })
            window.playlists = new Playlists("#ulSecondPlaylists", { id: "playlists", listenId: "*", redraw: true })

            //remove
            window.Playlists = Playlists
            require(["app/common/tabs"], function() {
                $('#secondViewTabs').tabs('option', 'active', 1)
            })

            var drawPlaylists = function() {
                var playlistsData = filterJStorageBy(typeLocalPlaylist)
                playlists.addElementsToList(playlistsData)
            }

            $('a[href="#secondPlaylistsDiv"]').click(function() {
//                playlists.emptyContent()
//                drawPlaylists()
            })

//            drawPlaylists()
        })
//    })
})