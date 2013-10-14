define(function () {
    function css(href) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = href;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    return {css:css}
})