define(function () {
    window.tooltipClick = function () {
        var property = new Object();
        property[this.id] = this.checked
        tooltipCallbacks[this.id](this.checked)
        chrome.storage.local.set(property)
    }

    window.tooltipsInit = function () {
        var tooltips = ['playTooltipCheckbox']
        for (var i = 0; i < tooltips.length; i++) {
            tooltipInit(tooltips[i])
        }
    }
    window.tooltipCallbacks = {
        'playTooltipCheckbox': function (toggle) {
            $('#playerWidgetContainer').find('.play>div, .pause>div').toggleClass('temp-tooltip-active', toggle)
        }
    }
    window.tooltipInit = function (tooltip) {
        var $tooltip = $('#' + tooltip).click(tooltipClick);
        chrome.storage.local.get(tooltip, function (options) {
            var toggle = _.keys(options).length ? _.values(options)[0] : true
            $tooltip.attr('checked', toggle)
            tooltipCallbacks[tooltip](toggle)
        })
    }
    tooltipsInit()
})
