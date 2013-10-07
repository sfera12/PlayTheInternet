define(["playlist", "iframe-observer"], function(a, observer) {
    $(document).ready(function () {
        window.windowId = 'backgroundPageId'
        window.playlist = new Playlist("#ulSecond",
            {
                id:windowId,
                redraw:true
            });
    })
    //TODO getRid of siteHandlersPti
    window.siteHandlersPti = observer.pti
    window.pti = observer.pti
})
