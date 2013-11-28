define(function () {
    window.tooltipClick = function () {
        var property = new Object();
        property[this.id] = this.checked
        tooltipCallbacks[this.id](this.checked)
        chrome.storage.local.set(property)
    }

    window.tooltipsInit = function () {
        var tooltips = ['playTooltipCheckbox', 'playlistTooltipCheckbox']
        for (var i = 0; i < tooltips.length; i++) {
            tooltipInit(tooltips[i])
        }
    }
    window.tooltipCallbacks = {
        'playTooltipCheckbox': function (toggle) {
            $('#playerWidgetContainer').find('.play>div').toggleClass('temp-tooltip-active', toggle)
        },
        'playlistTooltipCheckbox': function (toggle) {
            $('#ulSecond').toggleClass('temp-playlist-drop-here', toggle)
        }
    }
    window.tooltipInit = function (tooltip) {
        var $tooltip = $('#' + tooltip).click(tooltipClick);
        chrome.storage.local.get(tooltip, function (options) {
            var preparedOptions = _.keys(options).length ? options : undefined
            if (!_.isUndefined(preparedOptions)) {
                var toggle = _.values(preparedOptions)[0];
                $tooltip.attr('checked', toggle)
                tooltipCallbacks[tooltip](toggle)
            } else {
                $tooltip.attr('checked', true)
            }
        })
    }
    tooltipsInit()
})
