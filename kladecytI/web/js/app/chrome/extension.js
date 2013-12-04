define(function() {

    function headerClick(ui) {
        var options = _.values(this)[0]
        ui.parent().find('.selected').each(function (index, item) {
            var classes = $(item).attr('class').split(' ')
            var size = classes[0].replace(/set-\w+-/, '')
            if (classes[2].match(/size/)) {
                options.size = size
            } else if (classes[2].match(/split/)) {
                options.split = size
            }
        })
        chrome.storage.local.set(this)
    }

    function prepareOptions(options, defaults) {
        var values = _.values(options)[0]
        values = values ? values : {}
        defaults = defaults ? defaults : { size: undefined, split: undefined }
        options = _.defaults(values, defaults)
        return options
    }

    return { headerClick: headerClick, prepareOptions: prepareOptions }
})