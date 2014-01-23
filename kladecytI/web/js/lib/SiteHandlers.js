siteHandlers = [new YoutubeHandler(), new SoundCloudHandler(), new VimeoHandler()]

siteHandlerManager = new SiteHandlerManager();

function SiteHandlerManager() {
    SiteHandlerManager.prototype.mapping = new Object();
    SiteHandlerManager.prototype.errorTimeout

    SiteHandlerManager.prototype.setVideoFeed = function (videoFeed) {
        localStorage[videoFeed.id] = JSON.stringify(videoFeed)
    }

    SiteHandlerManager.prototype.reservedKeys = [
        "jStorage",
        "jStorage_update",
        "version"
    ]

    SiteHandlerManager.prototype.garbageCollector = function() {
        var videoIdsFromPlaylists = new Object()

        function idsFromJStoragePlaylist(id) {
            var ids = new Object(), playlistObj = $.jStorage.get(id);
            playlistObj && playlistObj.data && _.stringToArray(playlistObj.data).forEach(function (typeIdText) {
                var typeIdObj
                typeIdText && ((typeIdObj = _.stringToTypeId(typeIdText)) | (ids[typeIdObj.id] = '1'))
            })
            return ids
        }

        var storageObj = $.jStorage.storageObj(), jStorageKeys = Object.keys(storageObj.__proto__)
        var playlistIds = jStorageKeys.filter(function typeLocalPlaylist(key) {
            return key.match(/^lPlaylist/)
        })

        _.extend(videoIdsFromPlaylists, idsFromJStoragePlaylist("backgroundPageId"))
        playlistIds.forEach(function(playlistId) {
            _.extend(videoIdsFromPlaylists, idsFromJStoragePlaylist(playlistId))
        })

        var reservedKeysObject = _.object(SiteHandlerManager.prototype.reservedKeys, _.range(1, SiteHandlerManager.prototype.reservedKeys.length + 1))
        var dontRemoveKeys = _.extend(videoIdsFromPlaylists, reservedKeysObject)
        for (var key in localStorage) {
            key in dontRemoveKeys || localStorage.removeItem(key)
        }
    }

    SiteHandlerManager.prototype.getHandler = function (type) {
        var handler = SiteHandlerManager.prototype.mapping[type]
        if (handler) {
            return handler
        } else {
            throw 'Missing site handler for type: ' + type
        }
    }

    SiteHandlerManager.prototype.loadVideoFeed = function (linkContext) {
        var value
        if (linkContext.videoFeed && linkContext.videoFeed.template) {
            value = linkContext.videoFeed
        } else {
            var localStorageFeed = localStorage[linkContext.videoFeed.id]
            localStorageFeed && (value = $.parseJSON(localStorageFeed))
            //console.log(JSON.stringify(value) + 'FROM CACHE')
        }
//      console.log(value)
        if (value) {
            linkContext.fromCache = true;
            linkContext.videoFeed = value;
            SiteHandlerManager.prototype.fillVideoElement(linkContext);
        } else {
            linkContext.videoFeed.template = "rawTemplate"
            SiteHandlerManager.prototype.fillVideoElement(linkContext);
            SiteHandlerManager.prototype.getHandler(linkContext.videoFeed.type).loadVideoFeed(linkContext);
        }
    }

    SiteHandlerManager.prototype.playVideoFeed = function (videoFeed, playerState) {
            clearTimeout(SiteHandlerManager.prototype.errorTimeout)
            pti.loadVideo(videoFeed.type, videoFeed.id, playerState)
//            currentPlayingHandler = siteHandler
    }

    SiteHandlerManager.prototype.stateChange = function (state) {
        if (state == "NEXT") {
            playlist.playNextVideo()
        } else if (state == "ERROR") {
            SiteHandlerManager.prototype.errorTimeout = setTimeout(function () {
                playlist.playNextVideo()
            }, 2000)
        }
    }

    SiteHandlerManager.prototype.fillVideoElement = function (linkContext) {
        var videoFeed = linkContext.videoFeed;
        var videoElement = linkContext.videoElement;
        var handler = SiteHandlerManager.prototype.getHandler(videoFeed.type);
        if (videoFeed) {
            videoElement.div.html(handler[videoFeed.template](videoFeed))
            //todo workaround start
            if (videoFeed.template == "completeTemplate" || linkContext.fromCache) {
                typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                videoElement.div.data('videoFeed', videoFeed)
                //todo workaroung end
            }
            if (!linkContext.fromCache && linkContext.videoFeed.template == "completeTemplate") {
                SiteHandlerManager.prototype.setVideoFeed(videoFeed)
            }
        }
    }

    SiteHandlerManager.prototype.drawPtiElement = function(typeIdText, fillVideoElement) {
        var typeId = _.stringToTypeId(typeIdText)
        var $ptiElement = $('<div class="pti-element"></div>').data('data', typeId).attr('id', typeId.type + "=" + typeId.id)
        SiteHandlerManager.prototype.loadPtiElementData(typeId, $ptiElement, fillVideoElement)
        return $ptiElement
    }

    SiteHandlerManager.prototype.loadPtiElementData = function(typeId, $ptiElement, fillVideoElement) {
        if(!fillVideoElement) {
            SiteHandlerManager.prototype.updatePtiElement(typeId, $ptiElement, "rawTemplate")
            return
        }
        var lStorageDataText = localStorage[typeId.id], lStorageObject
        lStorageDataText && (lStorageObject = $.parseJSON(lStorageDataText))
        if(lStorageObject) {
            SiteHandlerManager.prototype.updatePtiElement(lStorageObject, $ptiElement, "completeTemplate", false)
        } else {
            var handler = SiteHandlerManager.prototype.getHandler(typeId.type)
            SiteHandlerManager.prototype.updatePtiElement(typeId, $ptiElement, "rawTemplate")
            handler.loadVideoData(typeId, $ptiElement)
        }
    }

    SiteHandlerManager.prototype.updatePtiElement = function(videoData, $ptiElement, template, cache) {
        var handler = SiteHandlerManager.prototype.getHandler(videoData.type)
        $ptiElement.html(handler[template](videoData))
        _.default(cache, true) && template === "completeTemplate" && localStorage.setItem(videoData.id, JSON.stringify(videoData))
    }

    SiteHandlerManager.prototype.getThumbnail = function(typeIdText) {
        if(typeIdText) {
            var typeId = _.stringToTypeId(typeIdText)
            var item = $.parseJSON(localStorage[typeId.id] ? localStorage[typeId.id] : "{}")
            var thumbnail = item && item.thumbnail ? item.thumbnail : SiteHandlerManager.prototype.getHandler(typeId.type)['defaultThumbnail']
            return thumbnail
        } else {
            return "favicon.ico"
        }
    }

    $.each(siteHandlers, function (index, item) {
        SiteHandlerManager.prototype.mapping[item.prefix] = item
    })
}

function YoutubeHandler() {
    YoutubeHandler.prototype.rawTemplate = PTITemplates.prototype.YoutubeRawTemplate
    YoutubeHandler.prototype.completeTemplate = PTITemplates.prototype.YoutubeCompleteTemplate
    YoutubeHandler.prototype.errorTemplate = PTITemplates.prototype.YoutubeErrorTemplate
    YoutubeHandler.prototype.data = function(data) {
        this.id = data.id
        this.type = YoutubeHandler.prototype.prefix
        this.duration = data.duration
        this.durationCaption = _.formatDuration(data.duration)
        this.title = data.title
        this.uploader = data.uploader
        this.thumbnail = data.thumbnail.sqDefault
    }
    YoutubeHandler.prototype.defaultThumbnail = "http://cdn.ndtv.com/tech/images/youtube_logo_120.jpg"
    YoutubeHandler.prototype.prefix = "y"
    //TODO https://www.youtube.com/embed/?listType=playlist&amp;list=PLhBgTdAWkxeBX09BokINT1ICC5IZ4C0ju&amp;showinfo=1
    YoutubeHandler.prototype.regex = /(youtu.be(\\?\/|\u00252F)|watch(([^ \'\'<>]+)|(\u0025(25)?3F))v(=|(\u0025(25)?3D))|youtube.com\\?\/embed\\?\/|youtube(\.googleapis)?.com\\?\/v\\?\/|ytimg.com\u00252Fvi\u00252F)([^?\s&\'\'<>\/\\.,#]{11})/
    YoutubeHandler.prototype.regexGroup = 11
    YoutubeHandler.prototype.loadVideoDataQueue = new Array()
    YoutubeHandler.prototype.loadVideoDataQueueConcurrent = 0
    YoutubeHandler.prototype.loadVideoDataQueueConcurrentMax = 25
    YoutubeHandler.prototype.queue = new Array()
    YoutubeHandler.prototype.queueConcurrent = 0
    YoutubeHandler.prototype.queueConcurrentMax = 25
    YoutubeHandler.prototype.queueExecute = function(linkContext) {
        YoutubeHandler.prototype.queueConcurrent++
        $.ajax({
            url: "http://gdata.youtube.com/feeds/api/videos/" + linkContext.videoFeed.id + "?v=2&alt=jsonc",
            success: function (data) {
                YoutubeHandler.prototype.queueConcurrent--
                try {
                    data.data.type = "y"
                    var videoFeed = new VideoFeed(data.data)
                    videoFeed.template = "completeTemplate"
                    linkContext.videoFeed = videoFeed
                    SiteHandlerManager.prototype.fillVideoElement(linkContext)
                } finally {
                    YoutubeHandler.prototype.queueNext()
                }
            },
            error: function (data) {
                try {
                    YoutubeHandler.prototype.queueConcurrent--
//                console.log(data.responseText)
                    try {
                        linkContext.videoFeed.error = $.parseJSON(data.responseText).error.message
                    } catch (e) {
                        linkContext.videoFeed.error = data.responseText.replace(/[\r\n]/g, '').replace(/.*((<code>)|(TITLE>))([\w\s]+)((<)|(<\/code>)).*/, "$4")
                    }
                    linkContext.videoFeed.template = "errorTemplate"
                    SiteHandlerManager.prototype.fillVideoElement(linkContext)
                    if (data.responseText.match(/too_many_recent_calls/)) {
                        setTimeout(function () {
                            YoutubeHandler.prototype.loadVideoFeed(linkContext)
                            console.log("retrying video")
                            if ($(linkContext.videoElement.div).parent().length > 0) {
                            } else {
                                console.log('playlist was emptied, wont continue loading info for this video')
                            }
                        }, 35000)
                    } else {
                        typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                    }
                } finally {
                    YoutubeHandler.prototype.queueNext()
                }
            },
            context: linkContext,
            dataType: 'json'
        })
    }
    YoutubeHandler.prototype.loadVideoDataQueueExecute = function(typeId, $ptiElement) {
        YoutubeHandler.prototype.loadVideoDataQueueConcurrent++
        $.ajax({
            url: "http://gdata.youtube.com/feeds/api/videos/" + typeId.id + "?v=2&alt=jsonc",
            success: function (data) {
                YoutubeHandler.prototype.loadVideoDataQueueConcurrent--
                try {
                    var videoData = new YoutubeHandler.prototype.data(data.data)
                    SiteHandlerManager.prototype.updatePtiElement(videoData, $ptiElement, "completeTemplate")
                } finally {
                    YoutubeHandler.prototype.loadVideoDataQueueNext()
                }
            },
            error: function (data) {
                try {
                    YoutubeHandler.prototype.loadVideoDataQueueConcurrent--
//                console.log(data.responseText)
                    try {
                        typeId.error = $.parseJSON(data.responseText).error.message
                    } catch (e) {
                        typeId.error = data.responseText.replace(/[\r\n]/g, '').replace(/.*((<code>)|(TITLE>))([\w\s]+)((<)|(<\/code>)).*/, "$4")
                    }
                    SiteHandlerManager.prototype.updatePtiElement(typeId, $ptiElement, "errorTemplate")
                    if (data.responseText.match(/too_many_recent_calls/)) {
                        setTimeout(function () {
                            YoutubeHandler.prototype.loadVideoData(typeId, $ptiElement)
                            console.log("retrying video")
                            if ($ptiElement.parent().length > 0) {
                            } else {
                                console.log('playlist was emptied, wont continue loading info for this video')
                            }
                        }, 35000)
                    } else {
                        typeof linkContext != "undefined" && typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                    }
                } finally {
                    YoutubeHandler.prototype.loadVideoDataQueueNext()
                }
            },
            dataType: 'json'
        })
    }
    YoutubeHandler.prototype.loadVideoFeed = function (linkContext) {
        YoutubeHandler.prototype.queue.push(linkContext)
        YoutubeHandler.prototype.queueNext()
    }
    YoutubeHandler.prototype.loadVideoData = function (typeId, $ptiElement) {
        YoutubeHandler.prototype.loadVideoDataQueue.push([typeId, $ptiElement])
        YoutubeHandler.prototype.loadVideoDataQueueNext()
    }
    YoutubeHandler.prototype.queueNext = function() {
        if (YoutubeHandler.prototype.queue.length && YoutubeHandler.prototype.queueConcurrent < YoutubeHandler.prototype.queueConcurrentMax) {
            var current = YoutubeHandler.prototype.queue[0]
            YoutubeHandler.prototype.queue = YoutubeHandler.prototype.queue.splice(1)
            YoutubeHandler.prototype.queueExecute(current)
        } else {
//            console.log('QueueNext end: [QueueLength: ' + YoutubeHandler.prototype.queue.length + '] [QueueConcurrent: ' + YoutubeHandler.prototype.queueConcurrent + ']')
        }
    }
    YoutubeHandler.prototype.loadVideoDataQueueNext = function() {
        if (YoutubeHandler.prototype.loadVideoDataQueue.length && YoutubeHandler.prototype.loadVideoDataQueueConcurrent < YoutubeHandler.prototype.loadVideoDataQueueConcurrentMax) {
            var current = YoutubeHandler.prototype.loadVideoDataQueue.shift()
            YoutubeHandler.prototype.loadVideoDataQueueExecute(current[0], current[1])
        } else {
//            console.log('QueueNext end: [QueueLength: ' + YoutubeHandler.prototype.queue.length + '] [QueueConcurrent: ' + YoutubeHandler.prototype.queueConcurrent + ']')
        }
    }
}

function SoundCloudHandler() {
    SoundCloudHandler.prototype.rawTemplate = PTITemplates.prototype.SoundCloudRawTemplate
    SoundCloudHandler.prototype.defaultThumbnail = "/css/resources/sc.jpeg"
    SoundCloudHandler.prototype.prefix = "s"
//    %3F
    SoundCloudHandler.prototype.regex = /((soundcloud.com(\\?\/|\u00252F))|(a class="soundTitle__title.*href="))([^.][^\s,?"=&#<]+)/
    SoundCloudHandler.prototype.regexGroup = 5
    SoundCloudHandler.prototype.loadVideoFeed = function (linksContext) {
        typeof linksContext.loadVideoFeedCallback == "function" && linksContext.loadVideoFeedCallback();
    }
    SoundCloudHandler.prototype.loadVideoData = function (typeId, $ptiElement) {

    }
}

function VimeoHandler() {
    VimeoHandler.prototype.rawTemplate = PTITemplates.prototype.VimeoRawTemplate
    VimeoHandler.prototype.completeTemplate = PTITemplates.prototype.VimeoCompleteTemplate
    VimeoHandler.prototype.data = function(data) {
        this.id = data.id
        this.type = VimeoHandler.prototype.prefix
        this.duration = data.duration
        this.durationCaption = _.formatDuration(data.duration)
        this.title = data.title
        this.uploader = data.user_name
        this.thumbnail = data.thumbnail_medium
    }
    VimeoHandler.prototype.defaultThumbnail = "/css/resources/vimeo.jpg"
    VimeoHandler.prototype.prefix = 'v'
    VimeoHandler.prototype.regex = /vimeo.com\\?\/((video\/)|(moogaloop.swf\?.*clip_id=))?(\d+)/
    VimeoHandler.prototype.regexGroup = 4
    VimeoHandler.prototype.loadVideoFeed = function (linkContext) {
        $.ajax({
            url:'https://vimeo.com/api/v2/video/' + linkContext.videoFeed.id + '.json',
            success:function (data) {
//                console.log(JSON.stringify(data[0]))
                data[0].type = VimeoHandler.prototype.prefix
                linkContext.videoFeed = new VideoFeed(data[0])
                linkContext.videoFeed.template = "completeTemplate"
                SiteHandlerManager.prototype.fillVideoElement(linkContext)
            },
            error:function (error) {
                typeof linkContext.loadVideoFeedCallback == "function" && linkContext.loadVideoFeedCallback()
                console.log('error in vimeoHandler loadVideoFeed start')
                console.log(error)
                console.log('error in vimeoHandler loadVideoFeed end')
            },
            dataType:'jsonp',
            timeout:10000
        })
    }
    VimeoHandler.prototype.loadVideoData = function (typeId, $ptiElement) {
        $.ajax({
            url:'https://vimeo.com/api/v2/video/' + typeId.id + '.json',
            success:function (data) {
                var videoData = new VimeoHandler.prototype.data(data[0])
                SiteHandlerManager.prototype.updatePtiElement(videoData, $ptiElement, "completeTemplate")
            },
            error:function (error) {
                console.log('error in vimeoHandler loadVideoFeed start')
                console.log(error)
                console.log('error in vimeoHandler loadVideoFeed end')
            },
            dataType:'jsonp',
            timeout:10000
        })
    }
}