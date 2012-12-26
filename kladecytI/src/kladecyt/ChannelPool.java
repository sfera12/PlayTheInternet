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
public class ChannelPool {
    public static String ENTITY_KIND = "ChannelPool";
    public static int SAFE_TIMEOUT = 5;
    public static HashMap<String, Channel> channelPool = (HashMap<String, Channel>) PersistPool.deserialize(new Entity(ENTITY_KIND, "Map"), new HashMap<String, Channel>());
    public static ArrayList<Channel> freeChannels = (ArrayList<Channel>) PersistPool.deserialize(new Entity(ENTITY_KIND, "List"), new ArrayList<Channel>());

    static ChannelService channelService = ChannelServiceFactory.getChannelService();


    public synchronized static Channel synchronize(String clientId, String operation) {
        Channel channel = null;
        if ("GET".equals(operation)) {
            channel = channelLookupAndCreate(clientId);
        } else if ("REMOVE".equals(operation)) {
            channel = channelPool.remove(clientId);
        } else if ("FREE".equals(operation)) {
            for (Iterator<Map.Entry<String, Channel>> it = channelPool.entrySet().iterator(); it.hasNext(); ) {
                Map.Entry<String, Channel> entry = it.next();
                if(clientId.equals(entry.getValue().channelClientId)) {
                    channel = entry.getValue();
                    printChannel("Removed channel from map and moved to list", channel);
                    it.remove();
                }
            }
            channel.assign("");
            printChannel("Moved to list", channel);
            freeChannels.add(channel);
            for (Iterator<Map.Entry<String, Channel>> it = channelPool.entrySet().iterator(); it.hasNext(); ) {
                Map.Entry<String, Channel> entry = it.next();
                Channel entryChannel = entry.getValue();
                if(entryChannel.connectionExpires != 0 && System.currentTimeMillis() >= entryChannel.connectionExpires) {
                    entryChannel = entry.getValue();
                    it.remove();
                    printChannel("Connection timedout on", entryChannel);
                    entryChannel.assign("");
                    freeChannels.add(entryChannel);
                }
            }

        } else if("CONNECTED".equals(operation)) {
            for (Iterator<Map.Entry<String, Channel>> it = channelPool.entrySet().iterator(); it.hasNext(); ) {
                Map.Entry<String, Channel> entry = it.next();
                if(clientId.equals(entry.getValue().channelClientId)) {
                    channel = entry.getValue();
                    channel.connectionExpires = 0;
                    printChannel("connected", channel);
                }
            }
        } else {
            System.out.println("UNRECOGNIZED OPERATION IN ChannelPool: " + operation);
        }

//        try {
            Entity entityMap = new Entity(ENTITY_KIND, "Map");
//            System.out.println("serialize");
            PersistPool.serialize(entityMap, channelPool);
            printMap(channelPool);

            Entity entityList = new Entity(ENTITY_KIND, "List");
            PersistPool.serialize(entityList, freeChannels);
            printList(freeChannels);

//            System.out.println("deserialize");
//            HashMap<String, Channel> deserializedMap = (HashMap<String, Channel>) PersistPool.deserialize(entity, new HashMap<String, Channel>());
//            printMap(deserializedMap);
//        } catch (Exception e) {
//            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }

        return channel;
    }


    public static Channel channelLookupAndCreate(String windowClientId) {
        Channel channel = lookup(windowClientId);
        if (channel == null) {
//            while (!freeChannels.isEmpty() && (channel = freeChannels.remove(0)) != null) {
//                if (!timeout(channel)) {
//                    channel.windowClientId = windowClientId;
//                    channelPool.put(windowClientId,  channel);
//                    printChannel("fromFreeChannels", channel);
//                    return channel;
//                }
//            }
            removeTimeout(freeChannels.iterator());
            if (!freeChannels.isEmpty() && (channel = freeChannels.remove(0)) != null) {
                put(windowClientId, channel);
                printChannel("fromFreeChannels", channel);
//                return channel;
            } else {
                channel = createNewChannel(windowClientId);
                printChannel("createdNewChannel", channel);
//                return channel;
            }
        } else {
            if (timeout(channel)) {
                channel = createNewChannel(windowClientId);
                channelPool.remove(windowClientId);
                printChannel("oldChannelTimeOut", channel);
//                return channel;
            }
            printChannel("returnedExistingChannel", channel);
//            return channel;
        }
        channel.assign(windowClientId);
        return channel;
    }

    public static Channel put(String windowClientId, Channel channel) {
            channel.assign(windowClientId);
            channelPool.put(windowClientId, channel);
        return channel;
    }


    private static Channel createNewChannel(String windowClientId) {
        String guid = UUID.randomUUID().toString();
        String token = "";
        int tokenDuration = 0;
        try {
            token = channelService.createChannel(guid, Channel.maxTokenDuration);
            System.out.println("MaxTokenDuration for channelClientId " + guid);
            tokenDuration = Channel.maxTokenDuration;
        } catch(Exception e) {
            token = channelService.createChannel(guid, Channel.tokenDuration);
            System.out.println("RegularTokenDuration for channelClientId " + guid);
            tokenDuration = Channel.tokenDuration;
        }
            Channel channel = new Channel(windowClientId, guid, token, tokenDuration);
            put(windowClientId, channel);
        return channel;
    }

    public static void removeTimeout(Iterator iterator) {
        String simpleName = iterator.getClass().getSimpleName();
        while(iterator.hasNext()) {
            Object nextObj = iterator.next();
            //Itr EntryIterator
            Channel channel = "Itr".equals(simpleName) ? (Channel)nextObj : ((Map.Entry<String, Channel>)nextObj).getValue();
            if(safeTimeout(channel)) {
                printChannel("Removed due to  safetimeout", channel);
                iterator.remove();
            }
        }
    }

    public static Channel lookup(String windowClientId) {
        Channel channel = channelPool.get(windowClientId);
        return (channel == null || !windowClientId.equals(channel.windowClientId) || timeout(channel)) ? null : channel;
    }

    public static void conntected(String channelClientId) {
        synchronize(channelClientId, "CONNECTED");
    }

    public static Channel getChannel(String windowClientId) {
        Channel channel = synchronize(windowClientId, "GET");
        return channel;
    }

    public static void removeChannel(String windowClientId) {
        synchronize(windowClientId, "REMOVE");
    }

    public static void disconnected(String channelClientId) {
        Channel channel = synchronize(channelClientId, "FREE");
        printChannel("disconnected", channel);
    }

    private static boolean timeout(Channel channel) {
        return genericTimeout(channel, 0);
    }

    private static boolean safeTimeout(Channel channel) {
        return genericTimeout(channel, SAFE_TIMEOUT);
    }

    private static boolean genericTimeout(Channel channel, int safe) {
        return System.currentTimeMillis() >= (channel.expirationTime.getTime()  - safe * 60000);
    }

    public static void printChannel(String operation, Channel channel) {
        System.out.println(String.format("%s [windowId: %s] [clientId: %s] [token: %s] [expires: %s] [connectionExpires: %s]", operation, channel.windowClientId, channel.channelClientId, channel.token, channel.expirationTime, new Date(channel.connectionExpires)));
    }

    public static void printMap(HashMap<String, Channel> map) {
        for(Map.Entry<String, Channel> entry : map.entrySet ()) {
            printChannel("Serialized", entry.getValue());
        }
    }

    private static void printList(ArrayList<Channel> channels) {
        for (Channel channel : channels) {
            printChannel("Serialized", channel);
        }
    }
}
