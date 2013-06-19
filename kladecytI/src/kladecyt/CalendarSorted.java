package kladecyt;

import com.google.appengine.api.datastore.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.Iterator;

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
        resp.setContentType("application/json; charset=utf-8");
//        Query query = new Query("Calendar").addFilter("date", Query.FilterOperator.LESS_THAN_OR_EQUAL, new Date().getTime()).addSort("date", Query.SortDirection.ASCENDING);
        Query query = setFilters(req);
        PreparedQuery preparedQuery = datastoreService.prepare(query);
        Iterator<Entity> iterator = preparedQuery.asIterator();
        StringBuilder output = null;
        if(iterator.hasNext()) {
            output = new StringBuilder();
            Entity firstEntity = iterator.next();
            output.append("[");
            output.append(((Text)firstEntity.getProperty("content")).getValue());
            while(iterator.hasNext()) {
                Entity entity = iterator.next();
                output.append(",");
                output.append(((Text)entity.getProperty("content")).getValue());
            }
            output.append("]");
        }
        if(output != null) {
            response(resp, output);
        } else {
            response(resp, new StringBuilder("[]"));
        }
    }

    private Query setFilters(HttpServletRequest req) {
        Query query = new Query("Calendar");
        String start = req.getParameter("start");
        Long startTime;
        if(start != null) {
            startTime = Long.valueOf(start);
        } else {
            startTime = 0L;
        }
        String end = req.getParameter("end");
        Long endTime;
        if(end != null) {
            endTime = Long.valueOf(end);
            query.addFilter("date", Query.FilterOperator.LESS_THAN_OR_EQUAL, endTime);
        }
        query.addFilter("date", Query.FilterOperator.GREATER_THAN_OR_EQUAL, startTime);

        return query.addSort("date", Query.SortDirection.DESCENDING);
    }

    private void response(HttpServletResponse resp, StringBuilder output) throws IOException {
        resp.getOutputStream().write(output.toString().getBytes("UTF-8"));
        System.out.println(output.toString());
    }
}
