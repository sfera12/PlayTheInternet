package kladecyt;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelPresence;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

/**
 * Created with IntelliJ IDEA.
 * User: AleksejBorisjuk
 * Date: 11/18/12
 * Time: 11:30 AM
 * To change this template use File | Settings | File Templates.
 */
public class ChannelServlet extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        ChannelService channelService = ChannelServiceFactory.getChannelService();
        BufferedWriter bufferedWriter = new BufferedWriter(resp.getWriter());
        if (req.getParameter("send") != null) {
            channelService.sendMessage(new ChannelMessage("xyz", req.getParameter("send")));
        } else if (req.getParameter("create") != null) {
            // The channelKey can be generated in any way that you want, as long as it remains
            // unique to the user.
            String channelKey = req.getParameter("create");
            String token = channelService.createChannel(channelKey);
            channelService.sendMessage(new ChannelMessage("xyz", "asdf"));
            req.getSession().setAttribute("clientId", token);
            resp.setContentType("text/plain");
            bufferedWriter.write(token);
            bufferedWriter.close();
        } else if (req.getParameter("session") != null) {
            bufferedWriter.write(req.getSession().getAttribute("clientId").toString());
            bufferedWriter.close();
        }
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        doGet(req, resp);
    }


}
