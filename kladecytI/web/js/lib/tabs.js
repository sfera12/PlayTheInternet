define('tabs', ['jquery', 'jquery-ui'], function ($) {
    var tabsPlayerContainer = $('#tabs .tabs-player-container')
    $('#tabs').tabs({
        activate:function (event, ui) {
            var newTab = $(ui.newTab);
            if (newTab.text() == "Options") {
                require(["hash-qr"], function (redraw) {
                    redraw()
                })
            }
            //        console.log(newTab.text())
            //            if(newTab.text() == "Calendar") {
            //                propagateCalendar()
            //            }
            if (newTab.text() == "Player") {
                tabsPlayerContainer.removeClass('leftFull')
                tabsPlayerContainer.addClass('tabs-player-container')
            } else {
                tabsPlayerContainer.addClass('leftFull')
                tabsPlayerContainer.removeClass('tabs-player-container')
            }
            newTab.addClass('active')
            $(ui.oldTab).removeClass('active')
        }
    })
})
