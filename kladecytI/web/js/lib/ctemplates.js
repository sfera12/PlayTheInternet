function PTITemplates(){}
PTITemplates.prototype.ptiElement = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="'+
((__t=( typeof id !== "undefined" ? id : obj ))==null?'':__t)+
'" class="pti-element"></div>';
}
return __p;
}
PTITemplates.prototype.YoutubeRawTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div><div class="image-div pti-sortable-handler"><img src="http://cdn.ndtv.com/tech/images/youtube_logo_120.jpg"><div class="pti-logo"></div><div class="pti-logo"></div></div><span class="videoText"><b>'+
((__t=( id ))==null?'':__t)+
'</b></span></div>';
}
return __p;
}
PTITemplates.prototype.YoutubeCompleteTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div><div class="image-div pti-sortable-handler"><img src="'+
((__t=( thumbnail ))==null?'':__t)+
'"><div class="duration-caption">'+
((__t=( durationCaption ))==null?'':__t)+
'</div><div class="pti-logo"></div></div><span class="videoText"><b>'+
((__t=( title ))==null?'':__t)+
'</b><br>by '+
((__t=( uploader ))==null?'':__t)+
'</span></div>';
}
return __p;
}
PTITemplates.prototype.YoutubeErrorTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div><div class="image-div pti-sortable-handler"><img src="http://s.ytimg.com/yts/img/meh7-vflGevej7.png"><div class="pti-logo"></div></div><span class="error-text"><b><a href="http://www.youtube.com/watch?v='+
((__t=(id))==null?'':__t)+
'" target="_blank">'+
((__t=(error))==null?'':__t)+
'</a></b></span></div>';
}
return __p;
}
PTITemplates.prototype.SoundCloudRawTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div><div class="image-div pti-sortable-handler"><img src="/css/resources/sc.jpeg"><div class="pti-logo"></div></div><span class="videoText"><b>'+
((__t=( id ))==null?'':__t)+
'</b></span></div>';
}
return __p;
}
PTITemplates.prototype.SoundCloudPlayerTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<iframe id="sc-widget" src="https://w.soundcloud.com/player/?url=https://soundcloud.com/timelock/timelock-ace-ventura-inside-us" width="100%" height="465" scrolling="no" frameborder="no"> </iframe>';
}
return __p;
}
PTITemplates.prototype.VimeoRawTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div><div class="image-div pti-sortable-handler"><img src="/css/resources/vimeo.jpg"><div class="pti-logo"></div></div><span class="videoText"><b>'+
((__t=( id ))==null?'':__t)+
'</b></span></div>';
}
return __p;
}
PTITemplates.prototype.VimeoCompleteTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div><div class="image-div pti-sortable-handler"><img src="'+
((__t=( thumbnail ))==null?'':__t)+
'"><div class="duration-caption">'+
((__t=( durationCaption ))==null?'':__t)+
'</div><div class="pti-logo"></div></div><span class="videoText"><b>'+
((__t=( title ))==null?'':__t)+
'</b><br>by '+
((__t=( uploader ))==null?'':__t)+
'</span></div>';
}
return __p;
}
PTITemplates.prototype.VimeoPlayerTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<iframe id="vimeo" src="http://player.vimeo.com/video/'+
((__t=( id ))==null?'':__t)+
'?api=1&player_id=vimeo" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
}
return __p;
}
PTITemplates.prototype.PlaylistGroupHeaderTemplate = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<label class="pti-droppable-target">'+
((__t=(name))==null?'':__t)+
'</label>';
}
return __p;
}
PTITemplates.prototype.ParsePlayTheInternetParseFunctionMissing = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-danger"><b>Please refresh(F5) currently open tab</b><br>('+
((__t=(href))==null?'':__t)+
')</div> </div> </div> </div>';
}
return __p;
}
PTITemplates.prototype.ParsePlayTheInternetParseNothingFound = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div id="parsedError" class="temp-parsed-error"> <div> <div> <div class="alert alert-warning"><b>Nothing found on</b><br>('+
((__t=(href))==null?'':__t)+
')</div> </div> </div> </div>';
}
return __p;
}
PTITemplates.prototype.PlaylistsVideoElement = function(obj){
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div> <div class="pti-sortable-handler image-div"><img src="'+
((__t=( typeof thumbnail !== "undefined" && thumbnail ? thumbnail : "/favicon.ico" ))==null?'':__t)+
'"> <div class="pti-logo"></div> </div> <div class="pti-playlists-content"> <div class="pti-playlists-info"> <input type="text" class="pti-name pti-clickable" value="'+
((__t=( name ))==null?'':__t)+
'"/> <div class="pti-count">'+
((__t=( data.length ))==null?'':__t)+
'</div> </div> <div class="pti-playlists-buttons"> <div class="pti-play-all pti-clickable">Play All</div> <div class="pti-add-all pti-clickable">Add All</div> <div class="pti-remove-playlist pti-clickable">Remove Playlist</div> </div> </div> </div>';
}
return __p;
}
