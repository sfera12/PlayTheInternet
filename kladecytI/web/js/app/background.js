define(["playlist", "iframe-observer"], function(a, observer) {
    $(document).ready(function () {
        window.windowId = 'backgroundPageId'
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                redraw:true
            });
    })
    window.pti = observer.pti
})
