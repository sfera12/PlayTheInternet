define(["playlist", "iframe-observer"], function(a, pti) {
    $(document).ready(function () {
        window.windowId = 'backgroundPageId'
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                redraw:true
            });
    })
})
