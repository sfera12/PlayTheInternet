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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
        Pattern methodAndIdPattern = Pattern.compile("/channel/([^/]+)(/([^/]+)){0,1}");
        Matcher methodAndId = methodAndIdPattern.matcher(req.getRequestURI());
        String method = "";
        String id = "";
        if(methodAndId.find()) {
            method = methodAndId.group(1);
            id = methodAndId.group(3);
            System.out.println(method + " " + id);
            if("create".equals(method) && !"".equals(id)) {
                String token = channelService.createChannel(id);
                req.getSession().setAttribute("clientId", id);
                writeAndClose(resp, token);
            } else if("send".equals(method) && req.getParameter("msg") != null) {
                if(id != null) {
                    channelService.sendMessage(new ChannelMessage(id, req.getParameter("msg")));
                } else {
                    channelService.sendMessage(new ChannelMessage(getClientId(req), req.getParameter("msg")));
                    writeAndClose(resp, "Added songs to playlist");
                }
            } else if("session".equals(method)) {
                Object clientIdObj = req.getSession().getAttribute("clientId");
                if(clientIdObj != null) {
                    writeAndClose(resp, (String)clientIdObj);
                } else {
                    System.out.println("clientId doesn't exist");
                }
            }
        }
//        if (req.getParameter("send") != null) {
//            channelService.sendMessage(new ChannelMessage("xyz", req.getParameter("send")));
//        } else if (req.getParameter("create") != null) {
//            // The channelKey can be generated in any way that you want, as long as it remains
//            // unique to the user.
//            String channelKey = req.getParameter("create");
//            String token = channelService.createChannel(channelKey);
//            channelService.sendMessage(new ChannelMessage("xyz", "asdf"));
//            req.getSession().setAttribute("clientId", token);
//            resp.setContentType("text/plain");
//            bufferedWriter.write(token);
//            bufferedWriter.close();
//        } else if (req.getParameter("session") != null) {
//            bufferedWriter.write(req.getSession().getAttribute("clientId").toString());
//            bufferedWriter.close();
//        }
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        doGet(req, resp);
    }

    public static void writeAndClose(HttpServletResponse resp, String text) throws IOException {
        BufferedWriter bufferedWriter = new BufferedWriter(resp.getWriter());
        resp.setContentType("text/plain");
        bufferedWriter.write(text);
        bufferedWriter.close();
    }

    public static String getClientId(HttpServletRequest req) {
        Object clientIdObj = req.getSession().getAttribute("clientId");
        return clientIdObj != null ? (String)clientIdObj : "";
    }
}
