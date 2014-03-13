function PTITemplates() {
}
PTITemplates.prototype.ptiElement = _.template('<div id="<%= id %>" class="<%= elementClass %>"></div>')

PTITemplates.prototype.YoutubeRawTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="/css/resources/youtube.jpg"><div class="pti-logo"></div><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.YoutubeCompleteTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-logo"></div></div><span class="videoText"><b><%= title %></b><br>by <%= uploader %></span></div>')
PTITemplates.prototype.YoutubeErrorTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="/css/resources/youtube-error.png"><div class="pti-logo"></div></div><span class="error-text"><b><a href="http://www.youtube.com/watch?v=<%=id%>" target="_blank"><%=error%></a></b></span></div>');

PTITemplates.prototype.SoundCloudRawTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="/css/resources/sc.jpeg"><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.SoundCloudPlayerTemplate = _.template('<iframe id="sc-widget" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/15969787" width="100%" height="465" scrolling="no" frameborder="no"> </iframe>')

PTITemplates.prototype.VimeoRawTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="/css/resources/vimeo.jpg"><div class="pti-logo"></div></div><span class="videoText"><b><%= id %></b></span></div>')
PTITemplates.prototype.VimeoCompleteTemplate = _.template('<div><div class="image-div pti-sortable-handler"><img src="<%= thumbnail %>"><div class="duration-caption"><%= durationCaption %></div><div class="pti-logo"></div></div><span class="videoText"><b><%= title %></b><br>by <%= uploader %></span></div>')
PTITemplates.prototype.VimeoPlayerTemplate = _.template('<iframe id="vimeo" src="http://player.vimeo.com/video/<%= id %>?api=1&player_id=vimeo" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>')

PTITemplates.prototype.PlaylistGroupHeaderTemplate = _.template('<label class="pti-droppable-target"><%=name%></label>')

PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing = _.template('<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-danger"><b>Please refresh(F5) currently open tab</b><br>(<%=href%>)</div> </div> </div> </div>')
PTITemplates.prototype.ParsePlayTheInternetParseNothingFound = _.template('<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-warning"><b>Nothing found on</b><br>(<%=href%>)</div> </div> </div> </div>')

PTITemplates.prototype.PlaylistsVideoElement = _.template('<div> <div class="pti-sortable-handler image-div"><img src="<%= typeof thumbnail !== "undefined" && thumbnail ? thumbnail : "/favicon.ico" %>"> <div class="pti-logo"><%=PTITemplates.prototype.FolderOpen()%></div> </div> <div class="pti-playlists-content"> <div class="pti-playlists-info"><input type="text" class="pti-name pti-clickable" value="<%= name %>"/> <div class="pti-count"><%= data.length %></div> </div> <div class="pti-playlists-buttons"> <div class="pti-play-all pti-clickable">Play All</div> <div class="pti-add-all pti-clickable">Add All</div> <div class="pti-remove-playlist"> <div class="pti-remove-playlist-dialog pti-clickable">Remove Playlist</div> <div class="pti-remove-playlist-yes pti-clickable temp-display-none-important">Yes</div> <div class="pti-remove-playlist-no pti-clickable temp-display-none-important">No</div> </div> </div> </div> </div>')

PTITemplates.prototype.FolderOpen = _.template('<svg viewBox="0 0 30 22" version="1.1">    <path d="m 4.3435431,6.6512019 c -0.2,0.6 -4.4999997,11.2000001 -4.4999997,11.2000001 V 2.9512019 c 0,-0.5 0.5,-1 1,-1 h 1.3 l 0.3,-1.1000001 c 0.2,-0.5 0.8,-0.9 1.2999997,-0.9 H 8.743543 c 0.5,0 1.1,0.4 1.3,0.9 l 0.3,1.1000001 h 9.3 c 0.5,0 1,0.5 1,1 v 3 H 5.1435431 c -0.1,0 -0.5,0.1 -0.8,0.7 z m 24.4999999,0.3 H 6.8435431 c -0.5,0 -1.2,0.4 -1.4,0.9 L 0.1435434,20.951202 c -0.2,0.5 0.1,0.9 0.6,0.9 H 22.743543 c 0.5,0 1.2,-0.4 1.4,-0.9 l 5.3,-13.1000001 c 0.2,-0.5 -0.1,-0.9 -0.6,-0.9 z" id="folderOpen""></path></svg>')
