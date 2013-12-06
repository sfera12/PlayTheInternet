define(["playlist"], function () {
    var version = localStorage.getItem('version')
    var currVersion = chrome.runtime.getManifest().version
    if(version == "undefined" ||  !version || (currVersion - version) >= 0.01) {
        $('#podHow').addClass('temp-how-extension-updates')
        var removeUpdateIcon = function() {
            localStorage.setItem('version', currVersion)
            $('#podHow').removeClass('temp-how-extension-updates')
            $('a[href="#howDiv"]').unbind('click', removeUpdateIcon)
        }
        $('a[href="#howDiv"]').click(removeUpdateIcon)
    }
    Playlist.prototype.setSlimScroll('#howDivContainer', '100%')
    $('#howDivContainer').on('click', '.temp-panel-heading-how', function () {
//        console.log(this)
        var $how = $(this), $content = $how.siblings()
        if ($content.length == 0) {
            var videoId = $how.attr('pti-video'), $el = $('<div class="temp-how-item"> <iframe width="560" height="315" src="http://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe> </div>').hide()
            $how.after($el)
            $el.show(150)
        } else {
            $content.hide(400, function () {
                $content.remove()
            })
        }
    })
})