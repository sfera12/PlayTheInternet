package kladecyt;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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
        StringBuffer out = new StringBuffer();
        String line = null;
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(req.getInputStream(), "UTF-8"));
        while((line = bufferedReader.readLine()) != null) {
//            System.out.println(line);
            out.append(line);
        }
//        System.out.println(out.toString());
        System.out.println(out.length());
        ChannelServlet.writeAndClose(resp, String.valueOf(out.length()));
    }
}
