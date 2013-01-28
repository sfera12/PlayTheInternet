package kladecyt;

import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.Entity;
import kladecyt.model.Channel;

import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: Ljoha
 * Date: 12/8/12
 * Time: 10:01 AM
 * To change this template use File | Settings | File Templates.
 */

//1 todo create new channel
//2 todo lookup for existing channel to send message
//3 todo reuse disconnected channels
//4 todo reuse created but not connected channels(issue date)
//5 todo remove expired channels(creation date)
//6 todo do not reuse channels that will live less than 5 minutes

public class ChannelPool {
    public static String ENTITY_KIND = "ChannelPool";
    public static ArrayList<Channel> channels = (ArrayList<Channel>) PersistPool.deserialize(new Entity(ENTITY_KIND, "ChannelList"), new ArrayList<Channel>());

    static ChannelService channelService = ChannelServiceFactory.getChannelService();

    public synchronized static Channel synchronize(String id, String operation) {
        Channel resultChannel = null;
        System.out.println(String.format("[id: %s] [operation: %s]", id, operation));
        Date now = new Date();
        for (Iterator<Channel> iterator = channels.iterator(); iterator.hasNext(); ) {
            Channel channel = iterator.next();
            if (now.after(channel.expirationDate)) {
                printChannel("Removed expired channel", channel);
                iterator.remove();
            }
        }


        if ("getChannel".equals(operation)) {
            resultChannel = synchLookup(id);
            if (resultChannel == null) {
                resultChannel = getFreeChannel(id);
                if (resultChannel == null) {
                    resultChannel = createNewChannel(id);
                    printChannel("New channel", resultChannel);
                } else {
                    resultChannel.assign(id);
                    printChannel("Reusing disconnected channel", resultChannel);
                }
            } else {
                resultChannel.assign(id);
                printChannel("Found connected channel", resultChannel);
            }
        } else if ("lookup".equals(operation)) {
            resultChannel = synchLookup(id);
            printChannel("lookup", resultChannel);
        } else if (operation.matches("connect|disconnect")) {
            synchConnectDisconnect(id, operation);
        } else {
            System.out.println("No such operation");
        }

        PersistPool.serialize(new Entity(ENTITY_KIND, "ChannelList"), channels);

        return resultChannel;
    }

    private static Channel getFreeChannel(String windowClientId) {
        Channel resultChannel = null;
        Date now = new Date();
        for (Channel channel : channels) {
            if (("".equals(channel.windowClientId) || now.before(channel.awaitingConnectionDate)) && now.before(channel.expirationDate)) {
                resultChannel = channel;
                resultChannel.assign(windowClientId);
                break;
            }
        }
        return resultChannel;
    }

    private static void synchConnectDisconnect(String channelClientId, String operation) {
        for (Channel channel : channels) {
            if (channelClientId.equals(channel.channelClientId)) {
                if ("connect".equals(operation)) {
                    channel.awaitingConnectionDate = new Date(0);
                } else if ("disconnect".equals(operation)) {
                    channel.windowClientId = "";
                } else {
                    System.out.println("Synch connect unknown operation");
                }
                printChannel(operation, channel);
            }
        }

    }

    private static Channel synchLookup(String windowClientId) {
        Channel resultChannel = null;
        for (Channel channel : channels) {
            if (windowClientId.equals(channel.windowClientId) && new Date().before(channel.expirationDate)) {
                resultChannel = channel;
                break;
            }
        }
        return resultChannel;
    }

    private static Channel createNewChannel(String windowClientId) {
        String guid = UUID.randomUUID().toString();
        String token = channelService.createChannel(guid, 720);
        Channel channel = new Channel(windowClientId, guid, token);
        add(channel);
        return channel;
    }

    private static void add(Channel channel) {
        channels.add(channel);
    }


    public static Channel getChannel(String windowClientId) {
        return synchronize(windowClientId, "getChannel");
    }

    public static Channel lookup(String windowClientId) {
        return synchronize(windowClientId, "lookup");
    }

    public static void connect(String channelClientId) {
        synchronize(channelClientId, "connect");
    }

    public static void disconnect(String channelClientId) {
        synchronize(channelClientId, "disconnect");
    }

    public static String printList(String message, ArrayList<Channel> channels) {
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append(message + "\r\n");
        System.out.println(message);
        for (Channel channel : channels) {
            stringBuffer.append(printChannel("Deserialized", channel));
            stringBuffer.append("\r\n");
        }
        return stringBuffer.toString();
    }

    public static String printChannel(String message, Channel channel) {
        String out = String.format("%s %s", message, channel == null ? "null" : channel.toString());
        System.out.println(out);
        return out;
    }
}
