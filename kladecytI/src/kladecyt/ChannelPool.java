package kladecyt;

import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import kladecyt.model.Channel;

import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: Ljoha
 * Date: 12/8/12
 * Time: 10:01 AM
 * To change this template use File | Settings | File Templates.
 */
public class ChannelPool {
    public static HashMap<String, Channel> channelPool = new HashMap<String, Channel>();
    public static ArrayList<Channel> freeChannels = new ArrayList<Channel>();

    static ChannelService channelService = ChannelServiceFactory.getChannelService();

    public static Channel getChannel(String windowClientId) {
        Channel channel = synchronize(windowClientId, "GET");
//        printChannel("getChannel", channel);
        return channel;
    }

    public static void removeChannel(String windowClientId) {
        synchronize(windowClientId, "REMOVE");
    }

    public static void freeChannel(String channelClientId) {

        Channel channel = synchronize(channelClientId, "FREE");
        printChannel("freeChannel", channel);
    }

    public synchronized static Channel synchronize(String clientId, String operation) {
        if ("GET".equals(operation)) {
            return channelLookupAndCreate(clientId);
        } else if ("REMOVE".equals(operation)) {
            channelPool.remove(clientId);
        } else if ("FREE".equals(operation)) {
            Channel channel = null;
            for(Map.Entry<String, Channel> entry : channelPool.entrySet()) {
                if(clientId.equals(entry.getValue().channelClientId)) {
                    channel = entry.getValue();
                    break;
                }
            }
            channel.windowClientId = "";
            freeChannels.add(channel);
            return channel;
        } else {
            System.out.println("UNRECOGNIZED OPERATION IN ChannelPool: " + operation);
        }
        return null;
    }

    public static Channel channelLookupAndCreate(String windowClientId) {
        Channel channel = lookup(windowClientId);
        if (channel == null) {
            while (!freeChannels.isEmpty() && (channel = freeChannels.remove(0)) != null) {
                if (!timeout(channel)) {
                    channel.windowClientId = windowClientId;
                    channelPool.put(windowClientId,  channel);
                    printChannel("fromFreeChannels", channel);
                    return channel;
                }
            }
            channel = createNewChannel(windowClientId);
            printChannel("createdNewChannel", channel);
            return channel;
        } else {
            if (timeout(channel)) {
                channel = createNewChannel(windowClientId);
                printChannel("oldChannelTimeOut", channel);
                return channel;
            }
            printChannel("returnedExistingChannel", channel);
            return channel;
        }
    }

    public static Channel lookup(String windowClientId) {
        Channel channel = channelPool.get(windowClientId);
        return (channel == null || !windowClientId.equals(channel.windowClientId) || timeout(channel)) ? null : channel;
    }

    private static Channel createNewChannel(String windowClientId) {
        String guid = UUID.randomUUID().toString();
        Channel channel = new Channel();
        channel.creationTime = new Date();
        channel.windowClientId = windowClientId;
        channel.token = channelService.createChannel(guid, Channel.tokenDuration);
        channel.channelClientId = guid;
        channelPool.put(windowClientId, channel);
        return channel;
    }

    private static boolean timeout(Channel channel) {
        return System.currentTimeMillis() >= (channel.creationTime.getTime() + (Channel.tokenDuration * 60000));
    }

    public static void printChannel(String operation, Channel channel) {
        System.out.println(String.format("%s [windowId: %s] [clientId: %s] [token: %s]", operation, channel.windowClientId, channel.channelClientId, channel.token));
    }
}
