define(["pti-playlist", "iframe-observer"], function(Playlist, observer) {
    $(document).ready(function () {
        observer.init()
        window.observer = observer
        window.pti = observer.pti
        window.windowId = 'backgroundPageId'
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                fillVideoElement:false
            });
        require(["app/background/commands", "app/background/contextMenus"])
    })
})
