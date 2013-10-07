define(["playlist", "iframe-observer"], function(Playlist, pti) {
    $(document).ready(function () {
        window.windowId = 'backgroundPageId'
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                redraw:true
            });
    })
})
