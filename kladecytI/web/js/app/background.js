define(["playlist", "iframe-observer"], function(a, observer) {
    $(document).ready(function () {
        observer.init()
        window.observer = observer
        window.pti = observer.pti
        window.windowId = 'backgroundPageId'
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                redraw:true,
                fillVideoElement:false
            });
        require(["app/background/commands", "app/background/contextMenus"])
    })
})
