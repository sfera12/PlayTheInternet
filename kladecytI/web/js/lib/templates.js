function PTITemplates() {
}
PTITemplates.prototype.YoutubeRawTemplate = _.template('<div><div class="image-div"><img src="http://cdn.ndtv.com/tech/images/youtube_logo_120.jpg"><div class="pti-logo"></div><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.YoutubeCompleteTemplate = _.template('<div><div class="image-div"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-logo"></div></div><span class="videoText"><b><%= title %></b><br>by <%= uploader %></span></div>')
PTITemplates.prototype.YoutubeErrorTemplate = _.template('<div><div class="image-div"><img src="http://s.ytimg.com/yts/img/meh7-vflGevej7.png"><div class="pti-logo"></div></div><span class="error-text"><b><a href="http://www.youtube.com/watch?v=<%=id%>" target="_blank"><%=error%></a></b></span></div>');

PTITemplates.prototype.SoundCloudRawTemplate = _.template('<div><div class="image-div"><img src="http://photos4.meetupstatic.com/photos/sponsor/9/5/4/4/iab120x90_458212.jpeg"><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.SoundCloudPlayerTemplate = _.template('<iframe id="sc-widget" src="https://w.soundcloud.com/player/?url=https://soundcloud.com/timelock/timelock-ace-ventura-inside-us" width="100%" height="465" scrolling="no" frameborder="no"> </iframe>')

PTITemplates.prototype.VimeoRawTemplate = _.template('<div><div class="image-div"><img src="http://www.siliconrepublic.com/fs/img/news/201208/rs-120x90/vimeo.jpg"><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.VimeoCompleteTemplate = _.template('<div><div class="image-div"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-logo"></div></div><span class="videoText"><b><%= title %></b><br>by <%= uploader %></span></div>')
PTITemplates.prototype.VimeoPlayerTemplate = _.template('<iframe id="vimeo" src="http://player.vimeo.com/video/<%= id %>?api=1&player_id=vimeo" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>')

PTITemplates.prototype.PlaylistGroupHeaderTemplate = _.template('<label class="pti-droppable-target"><%=name%></label>')
