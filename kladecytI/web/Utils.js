
function VideoFeed (item, parent) {
    if(item == null) throw "kladecyt: null vId argument in VideoFeed Constructor"
    this.videoId = item.id
    this.duration = item.duration
    this.durationCaption = convert(item.duration)
    this.title = item.title
    this.uploader = item.uploader
    this.thumbnail = item.thumbnail.sqDefault
}