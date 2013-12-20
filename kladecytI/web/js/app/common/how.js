define(["playlist"], function () {
    var version = localStorage.getItem('version')
    var currVersion = chrome.runtime.getManifest().version
    var release = currVersion.replace(/^(\d+\.\d{2}).*/, '^$1')
    if(!version || !version.match(release)) {
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
        var $how = $(this), $contentSiblings = $how.siblings()
        if ($contentSiblings.length == 0) {
            var videoId = $how.attr('pti-video'), $el = $('<div class="temp-how-item"> <iframe width="560" height="315" src="http://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe> </div>').hide()
            $how.after($el)
            $el.show(150)
        } else {
            $contentSiblings.hide(400, function () {
                $contentSiblings.remove()
            })
        }
    })
})