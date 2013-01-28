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
    public String windowClientId;
    public String channelClientId;
    public String token;
    public Date issueDate;
    private long AWAITING_CONNECTION = 300000;
    public Date awaitingConnectionDate;
    public Date creationDate;
    private long CHANNEL_DURATION = 43200000;
    public Date expirationDate;

    public Channel(String windowClientId, String channelClientId, String token) {
        this.channelClientId = channelClientId;
        this.token = token;
        this.creationDate = new Date();
        this.expirationDate = new Date(System.currentTimeMillis() + CHANNEL_DURATION);
        assign(windowClientId);
    }

    public void assign(String windowClientId) {
        this.windowClientId = windowClientId;
        this.issueDate = new Date();
        this.awaitingConnectionDate = new Date(System.currentTimeMillis() + AWAITING_CONNECTION);
    }


    public String toString() {
        return String.format("[WindowId: %s] [ChannelId: %s] [Token: %s] [Issue: %s] [AwaitingConnection: %s] [Creation: %s] [Expiration: %s]", windowClientId, channelClientId, token, issueDate, awaitingConnectionDate, creationDate, expirationDate);    }

}
