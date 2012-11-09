package kladecyt;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class KladecytServlet extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        resp.setContentType("text/plain");
        String output = "";
        try {
            // Construct data

            URL url = new URL("https://gdata.youtube.com/feeds/api/playlists/D9FF44E575627088/batch?v=2");
            // Send data
            URLConnection conn = url.openConnection();
            conn.setDoOutput(true);
            conn.addRequestProperty("X-GData-Key", "key=AI39si7HfoC0D23HMvCVneJoEMLnFazkdi1r2zogNH0EWGjh5EFVOOlBGnSVl5JWdIzu7nBRvZfN_72unfxU10hZniIVBqiiIg");
            conn.addRequestProperty("Authorization", "AuthSub token=\"2/4pZq-p8hsU6gHB4bFnjXD-TsOHGSgnEq5I_E4LYv4Ik\"");
            conn.addRequestProperty("Content-Type", "application/atom+xml");
            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
            String data = "<feed xmlns=\"http://www.w3.org/2005/Atom\" xmlns:media=\"http://search.yahoo.com/mrss/\" xmlns:batch=\"http://schemas.google.com/gdata/batch\" xmlns:yt=\"http://gdata.youtube.com/schemas/2007\"><batch:operation type=\"update\"/><entry><batch:operation type=\"insert\"/><id>sCKe65D-uyo</id></entry></feed>";
            wr.write(data);
            wr.flush();

            // Get the response
            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            while ((line = rd.readLine()) != null) {
                output += line;
            }
            wr.close();
            rd.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        resp.getWriter().println(output);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
//		resp.setContentType("text/plain");
//		String output = "";

        BufferedReader reader = req.getReader();
        try {
            // Construct data
            System.out.println("sleeping 10 seconds");
//			Thread.sleep(10000);
            URL url = new URL("https://gdata.youtube.com/feeds/api/playlists/CA124CA904A9D9BE/batch");
            // Send data
            URLConnection conn = url.openConnection();
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(10000);
            conn.setDoOutput(true);
            conn.addRequestProperty("GData-Version", "2");
            conn.addRequestProperty("X-GData-Key", "key=AI39si7HfoC0D23HMvCVneJoEMLnFazkdi1r2zogNH0EWGjh5EFVOOlBGnSVl5JWdIzu7nBRvZfN_72unfxU10hZniIVBqiiIg");
            conn.addRequestProperty("Authorization", "Bearer " + req.getHeader("Bearer"));
            conn.addRequestProperty("Content-Type", "application/atom+xml");
            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
            String data = reader.readLine();
            System.out.println(data);
            wr.write(data);
            long start = System.currentTimeMillis();
            wr.flush();

            // Get the response
            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            String output = "";
            while ((line = rd.readLine()) != null) {
                output += line;
            }
            System.out.println(output);
            System.out.println(System.currentTimeMillis() - start);
            wr.close();
            rd.close();
        } catch (Exception e) {
            e.printStackTrace();
            resp.addHeader("status-code", "200");
            resp.getWriter().println();
        }
        resp.getWriter().println();
    }
}
