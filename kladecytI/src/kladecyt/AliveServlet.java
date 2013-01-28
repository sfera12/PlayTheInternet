package kladecyt;

import com.google.appengine.api.channel.ChannelPresence;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: AleksejBorisjuk
 * Date: 11/19/12
 * Time: 9:56 AM
 * To change this template use File | Settings | File Templates.
 */
public class AliveServlet extends HttpServlet {
    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        ChannelService channelService = ChannelServiceFactory.getChannelService();
        ChannelPresence presence = channelService.parsePresence(req);
//        System.out.println(String.format("doPost [Client Id: %s] [IsConnected: %s]", presence.clientId(), presence.isConnected()));
        if (presence.isConnected() == false) {
            ChannelPool.disconnect(presence.clientId());
        } else if (presence.isConnected() == true) {
            ChannelPool.connect(presence.clientId());
        }
    }
}
