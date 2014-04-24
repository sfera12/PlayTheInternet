define(["app/common/tabs"], function() {
    var gimpedAnimation = [
        {nav:"#player", fixed:"#podPlayer"},
        {nav:"#tAreaDiv", fixed:"#podTa"},
        {nav:"#optionsDiv", fixed:"#podOptions"},
        {nav:"#recycleBinDiv", fixed:"#podBin"}
    ]

    fc = 220

    $.each(gimpedAnimation, function (index, item) {
        var rgb = function (number) {
            console.log(number)
            return 'rgb(' + number + ', ' + number + ', ' + number + ')'
        }
        $('a[href="' + item.nav + '"]').mouseenter(function (event, ui) {
            $(item.fixed).animate({height:"100%"}, { queue:false, duration:500})
        }).mouseleave(function (event, ui) {
                $(item.fixed).animate({
                    height:"0%"
                }, 600, 'linear', function () {
                    $('a[href="' + item.nav + '"]').removeClass('post-hover')
                });
                $(item.fixed).addClass('post-hover')
                $('a[href="' + item.nav + '"]').addClass('post-hover')
            });
    })
})