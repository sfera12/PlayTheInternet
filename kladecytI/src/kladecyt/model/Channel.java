package kladecyt.model;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: Ljoha
 * Date: 12/8/12
 * Time: 10:21 AM
 * To change this template use File | Settings | File Templates.
 */
public class Channel {
    public static int maxTokenDuration = 600;
    public static int tokenDuration = 120;
    public Date creationTime = new Date();
    public Date expirationTime;
    public String windowClientId;
    public String channelClientId;
    public String token;

    public Channel(String windowClientId, String channelClientId, String token, int channelDuration) {
        this.windowClientId = windowClientId;
        this.channelClientId = channelClientId;
        this.token = token;
        this.creationTime = new Date();
        this.expirationTime = new Date(this.creationTime.getTime() + channelDuration * 60000);
    }
}
