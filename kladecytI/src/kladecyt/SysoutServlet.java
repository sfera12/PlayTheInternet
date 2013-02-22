package kladecyt;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: AleksejBorisjuk
 * Date: 2/22/13
 * Time: 3:08 PM
 * To change this template use File | Settings | File Templates.
 */
public class SysoutServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println(new Date().toString() + " " + req.getReader().readLine());
        ChannelServlet.writeAndClose(resp, "/iframe out");
    }
}
