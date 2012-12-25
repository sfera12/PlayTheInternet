package kladecyt;

import com.google.appengine.api.channel.ChannelMessage;
import kladecyt.model.Channel;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.PrintWriter;
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
        try {
            Pattern methodAndIdPattern = Pattern.compile("/channel/([^/]+)(/([^/]+)){0,1}");
            Matcher methodAndId = methodAndIdPattern.matcher(req.getRequestURI());
            String method = "";
            String id = "";
            if (methodAndId.find()) {
                method = methodAndId.group(1);
                id = methodAndId.group(3);
                System.out.println(method + " " + id);
                if ("create".equals(method) && !"".equals(id)) {
//                if(!"".equals(getWindowClientId(req))) {
//                    id = getWindowClientId(req);
//                }
//                System.out.println(id);
                    Channel channel = ChannelPool.getChannel(id);
                    String token = channel.token;
                    req.getSession().setAttribute("windowClientId", channel.windowClientId);
//                System.out.println(String.format("create {windowClientId: %s] [channelClientId: %s] [token: %s]", channel.windowClientId, channel.channelClientId, channel.token));
                    writeAndClose(resp, token);
                } else if ("send".equals(method) && req.getParameter("msg") != null) {

                    String sessionWindowClientId = getWindowClientId(req);
                    Channel channel = ChannelPool.lookup(sessionWindowClientId);
                    if (channel != null) {
                        ChannelPool.channelService.sendMessage(new ChannelMessage(channel.channelClientId, req.getParameter("msg")));
                        writeAndClose(resp, "Added songs to playlist");
                        System.out.println(String.format("Sent message to window client id %s", sessionWindowClientId));
                    } else if (id != null) {
                        ChannelPool.channelService.sendMessage(new ChannelMessage(id, req.getParameter("msg")));
                        writeAndClose(resp, "Added songs to playlist for clientId: " + id);
                    } else {
                        writeAndClose(resp, "I'm sorry can't add songs to playlist either because you closed playtheinternet window or there's something wrong with application and WE ALL GONNA DIE.");
                    }
//                if(id != null) {
//                    ChannelPool.channelService.sendMessage(new ChannelMessage(id, req.getParameter("msg")));
//                } else {
//                    Channel channel = ChannelPool.getChannel(getWindowClientId(req));
//                    ChannelPool.channelService.sendMessage(new ChannelMessage(channel.channelClientId, req.getParameter("msg")));
//                    writeAndClose(resp, "Added songs to playlist");
//                }
                } else if ("session".equals(method)) {
                    Object clientIdObj = req.getSession().getAttribute("windowClientId");
                    if (clientIdObj != null) {
                        writeAndClose(resp, (String) clientIdObj);
                    } else {
                        System.out.println("windowClientId doesn't exist");
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
//            req.getSession().setAttribute("channelClientId", token);
//            resp.setContentType("text/plain");
//            bufferedWriter.write(token);
//            bufferedWriter.close();
//        } else if (req.getParameter("session") != null) {
//            bufferedWriter.write(req.getSession().getAttribute("channelClientId").toString());
//            bufferedWriter.close();
//        }
        } catch (Exception e) {
            PrintWriter writer = resp.getWriter();
            e.printStackTrace(writer);
            e.printStackTrace(System.out);
            writer.close();
        }
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

    public static String getWindowClientId(HttpServletRequest req) {
        Object clientIdObj = req.getSession().getAttribute("windowClientId");
        return clientIdObj != null ? (String) clientIdObj : "";
    }
}
