
function VideoFeed (item, parent) {
    if(item == null) throw "kladecyt: null vId argument in VideoFeed Constructor"
    if(item.thumbnail != null) {
        this.videoId = item.id
        this.duration = item.duration
        this.durationCaption = convert(item.duration)
        this.title = item.title
        this.uploader = item.uploader
        this.thumbnail = item.thumbnail.sqDefault
    } else if(item.id.$t != "") {
        this.videoId = item.id.$t.replace(/.*video\:(.*)/, "$1")
        this.duration = item.media$group.media$content[0].duration
        this.durationCapption = item.media$group.media$thumbnail[0].time.replace(/(.*)\.\d+/, "$1")
        this.title = item.title.$t
        this.uploader = item.author[0].name.$t
        this.thumbnail = item.media$group.media$thumbnail[0].url
    }  else {
        this.error = "incompatible type"
        console.log("incompatible type" + item)
    }
}

function VideoElement(videoFeed, appendTo) {
    this.createDiv = function(videoFeed) {
        this.div = $('<div/>')
        this.div.addClass('ui-state-default')
        $(appendTo).append(this.div)
        if(videoFeed != null) {
            this.fillDiv(videoFeed)
        }
    }

    this.fillDiv = function(videoFeed) {
        var durationCaption = $('<div/>')
        durationCaption.addClass('duration-caption')
        durationCaption.text(videoFeed.durationCaption)

        var imgDiv = $('<div/>')
        imgDiv.addClass('image-div')

        var img = $('<img/>')
        img.attr('src', videoFeed.thumbnail)

        var span = $('<span/>')
        var b = $('<b>').text(videoFeed.title)
        span.append(b)
        span.append("<br>by " + videoFeed.uploader)

        imgDiv.append(img)
        imgDiv.append(durationCaption)
        this.div.append(imgDiv)
        this.div.append(span)
        this.div.click(function() {
            $('#iCriteria').attr('value', videoFeed.videoId)
            $('#iTitle').attr('value', videoFeed.title + '\t' + videoFeed.videoId)
        })
        durationCaption.css('left', 120 - durationCaption.width() - 3)
        durationCaption.css('top', 90 - durationCaption.height() -3)

        this.div.data("videoFeed", videoFeed)

        return this.div
    }

    this.createDiv(videoFeed)

    return this
}

function convert(duration) {
    var tbl = [
        [ 7*24*60*60, 'week' ],
        [ 24*60*60, 'day' ],
        [ 60*60, 'hour' ],
        [ 60, 'minute' ],
        [ 1, 'second' ]
    ];
    var t = parseInt(duration);
    var r = '';
    var out = [];
    for (var i = 0; i < tbl.length; i++) {
        var d = tbl[i];
        if (t > d[0]) {
            var u = Math.floor(t / d[0]);
            t -= u * d[0];
            u < 10 ? out.push('0' + u) : out.push(u)
        } else if (i >= 3 ) {
            out.push('00')
        }
    }
    return out.join(":")
}

Array.prototype.unique =
    function() {
        var a = [];
        var l = this.length;
        for(var i=0; i<l; i++) {
            for(var j=i+1; j<l; j++) {
                // If this[i] is found later in the array
                if (this[i] === this[j])
                    j = ++i;
            }
            a.push(this[i]);
        }
        return a;
    };