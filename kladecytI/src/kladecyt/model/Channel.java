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
    public static int tokenDuration = 120;
    public Date creationTime = new Date();
    public String windowClientId;
    public String channelClientId;
    public String token;
}
