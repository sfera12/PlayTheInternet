define(["common/ptilist"], function(Ptilist) {
    function Playlists(appendToElementExpression) {
        var me = this
        var ptilist = new Ptilist(appendToElementExpression, {
            drawElement: PTITemplates.prototype.PlaylistsVideoElement,
            elementSplit: "one"
        })

        ptilist.jContent.on('keypress', '.pti-name', function(event) {
            if(event.keyCode == 13) {
                $(this).blur()
            }
        })
        for(var i=0; i<4; i++) {ptilist.addElementsToList([{"name": "asdf", count: 100}])}
//        this.addElementsToList = ptilist.addElementsToList
    }

    return Playlists
})