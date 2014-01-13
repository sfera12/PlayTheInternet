define(["common/playlists"], function() {

//    $('#secondViewTabs a[href="#secondPlaylistsDiv"]').click(function () {
        require(["common/playlists"], function(Playlists) {
            window.playlists = new Playlists("#ulSecondPlaylists")

            //remove
            window.Playlists = Playlists
            require(["app/common/tabs"], function() {
                $('#secondViewTabs').tabs('option', 'active', 1)
            })
            for(var i=0; i<4; i++) {playlists.addElementsToList([{"name": "asdf", count: 100}])}
            //remove
        })
//    })
})