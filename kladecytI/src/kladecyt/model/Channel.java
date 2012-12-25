package kladecyt.model;

import java.io.Serializable;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: Ljoha
 * Date: 12/8/12
 * Time: 10:21 AM
 * To change this template use File | Settings | File Templates.
 */
public class Channel implements Serializable {
    public static int maxTokenDuration = 720;
    public static int tokenDuration = 120;
    public static int connectionTimeout = 5;
    public Date expirationTime;
    public long connectionExpires;
    public String windowClientId;
    public String channelClientId;
    public String token;

    public Channel(String windowClientId, String channelClientId, String token, int channelDuration) {
        this.windowClientId = windowClientId;
        this.channelClientId = channelClientId;
        this.token = token;
        this.expirationTime = new Date(System.currentTimeMillis() + channelDuration * 60000);
        this.connectionExpires = connectionExpires();
    }

    public void assign(String windowClientId) {
        this.windowClientId = windowClientId;
        this.connectionExpires = connectionExpires();
    }

    private long connectionExpires() {
        return System.currentTimeMillis() + connectionTimeout * 60000;
    }
}
