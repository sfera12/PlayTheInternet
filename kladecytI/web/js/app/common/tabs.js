define(['jquery', 'jquery-ui'], function ($) {
    var tabsPlayerContainer = $('#tabs .tabs-player-container')
    $('#tabs, #secondViewTabs').tabs({
        activate:function (event, ui) {
            var newTab = $(ui.newTab);
            if (newTab.text() == "Options") {
                require(["app/common/hash-qr"], function (redraw) {
                    redraw()
                })
            }
            //        console.log(newTab.text())
            //            if(newTab.text() == "Calendar") {
            //                propagateCalendar()
            //            }
            if (newTab.text() == "Player") {
                tabsPlayerContainer.removeClass('temp-absolute-off-scren')
                tabsPlayerContainer.addClass('tabs-player-container')
            } else {
                tabsPlayerContainer.addClass('temp-absolute-off-scren')
                tabsPlayerContainer.removeClass('tabs-player-container')
            }
            newTab.addClass('active')
            $(ui.oldTab).removeClass('active')
        }
    })
})
