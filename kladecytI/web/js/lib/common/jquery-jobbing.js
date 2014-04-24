define(["jquery-ui"], function() {
    $.dropdown = function($container, $navs) {
        var $source = $navs.map(function (index, item) {
            var $item = $(item)
            return { label: $item.text(), value: $item }
        }).get()
        var $dropdown = $container.find('input[type="button"]'), $caret = $container.find('button')
        $dropdown.autocomplete({
            appendTo: $container,
            close: function() {
                $caret.removeClass('pti-active')
            },
            source: $source,
            minLength: 0,
            select: function( event, ui ) {
                _.defer(function() {
                    $dropdown.autocomplete('close')
                    $navs.not(ui.item.value).css('display', 'none')
                    ui.item.value.css('display', 'block').click()
                })
            }
        })
        var $menu = $container.find('ul').addClass('dropdown-menu');
        $container.click(function() {
            $caret.addClass('pti-active')
            $dropdown.autocomplete("search", "")
            $menu.removeAttr('style').css('display', 'block')
            $dropdown.focus()
        })
    }
})