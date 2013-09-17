// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl":"js/lib",
    "paths":{
        "app":"../app",
        "jquery":"jquery-2.0.3.min",
        "jqueryui":"jquery-ui-1.10.3.custom.min",
        "underscore":"underscore-min",
        "jstorage":"jstorage.min",
        "sitehandlers":"SiteHandlers",
        "playlist":"Utils",
        "slimscroll":"jquery.slimscroll",
        "playerwidget":"player-widget",
        "qrcode":"jquery.qrcode",
        "pti-abstract":"PTI",
        "pti":"iframe-player",
        "youtube":"iframe-youtube",
        "youtube-api":"https://www.youtube.com/iframe_api?lol",
        "soundcloud":"iframe-soundcloud",
        "soundcloud-api":"sc-api",
        "vimeo":"iframe-vimeo",
        "vimeo-api":"vim-froogaloop2.min"
    },
    "shim":{
        "jqueryui":["jquery"],
        "jstorage":["jquery"],
        "sitehandlers":["jquery", "underscore", "jstorage"],
        "playlist":["sitehandlers", "slimscroll"],
        "slimscroll":["jqueryui"],
        "playerwidget":["jquery", "underscore"],
        "qrcode":["jquery", "qrcode-core"],
        "pti":["pti-abstract", "jquery", "underscore"],
        "youtube":["pti", "jquery", "underscore"],
        "youtube-api":["youtube"],
        "soundcloud":["pti", "soundcloud-api", "jquery", "underscore"],
        "vimeo":["pti", "vimeo-api", "jquery", "underscore"],
        "pti-web":["youtube", "soundcloud", "vimeo", "jquery", "underscore"]
    }
});

// Load the main app module to start the app
requirejs(["app/web"]);
