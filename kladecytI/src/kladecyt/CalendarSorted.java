package kladecyt;

import com.google.appengine.api.datastore.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: AleksejBorisjuk
 * Date: 5/30/13
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */
public class CalendarSorted extends HttpServlet {
    private static DatastoreService datastoreService = DatastoreServiceFactory.getDatastoreService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Query query = new Query("Calendar").addFilter("date", Query.FilterOperator.LESS_THAN_OR_EQUAL, new Date().getTime()).addSort("date", Query.SortDirection.ASCENDING);
        PreparedQuery preparedQuery = datastoreService.prepare(query);
        Iterable<Entity> entities = preparedQuery.asIterable();
        for (Entity entity : entities) {
            System.out.println(entity.getProperty("date"));
        }
    }
}
