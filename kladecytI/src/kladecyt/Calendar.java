package kladecyt;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: AleksejBorisjuk
 * Date: 5/30/13
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */
public class Calendar extends HttpServlet {
    private static DatastoreService datastoreService = DatastoreServiceFactory.getDatastoreService();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Entity entity = new Entity("Calendar");
//        req.getParameter("date");
//        req.getParameter("user");
//        byte[] bytes = new byte[1024];
//        req.getInputStream().read(bytes);
//        System.out.println(new String(bytes, "UTF-8"));
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
        try {
            InputStream inputStream = req.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(
                        inputStream));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            } else {
                stringBuilder.append("");
            }
        } catch (IOException ex) {
            throw ex;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }
        String body = stringBuilder.toString();
        System.out.println(body);
        System.out.println(req.getParameter("date"));
        System.out.println(req.getParameter("user"));
//        datastoreService.put(entity);
    }
}
