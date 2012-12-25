package kladecyt;

import com.google.appengine.api.datastore.*;
import kladecyt.model.Channel;

import java.io.*;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Created with IntelliJ IDEA.
 * User: Ljoha
 * Date: 12/24/12
 * Time: 11:48 AM
 * To change this template use File | Settings | File Templates.
 */
public class PersistPool {
    private static DatastoreService datastoreService = DatastoreServiceFactory.getDatastoreService();

    public static Object deserialize(Entity entity, Object emptyCollection){
        try {
            Entity dsEntity = dsEntity = datastoreService.get(entity.getKey());
            Blob property = (Blob) dsEntity.getProperty("binary");
            byte[] blobChannelBytes = property.getBytes();

            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(blobChannelBytes);
            ObjectInputStream objectInputStream = new ObjectInputStream(byteArrayInputStream);
            Object desObject = objectInputStream.readObject();
            Iterator iterator = "HashMap".equals(desObject.getClass().getSimpleName()) ? ((HashMap<String, Channel>)desObject).entrySet().iterator() : ((Collection)desObject).iterator();
            ChannelPool.removeTimeout(iterator);
            System.out.println(String.format("Deserialized %s", entity.getKey()));
            return desObject;
        } catch (EntityNotFoundException e) {
            System.out.println(String.format("Initializing Entity %s", entity.getKey()));
            return emptyCollection;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    public static void serialize(Entity entity, Object object) {
        try {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ObjectOutputStream objectOutputStream  = new ObjectOutputStream(byteArrayOutputStream);
        objectOutputStream.writeObject(object);
        objectOutputStream.close();

        byte[] bytes = byteArrayOutputStream.toByteArray();

        Blob blob = new Blob(bytes);
        entity.setProperty("binary", blob);
        System.out.println(String.format("Serialized %s", entity.getKey()));
        datastoreService.put(entity);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void persistPool(HashMap<String, Channel> channelPool) {
        ObjectOutputStream objectOutputStream;
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ObjectInputStream objectInputStream;
        try {
            objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
            objectOutputStream.writeObject(ChannelPool.channelPool);
            objectOutputStream.close();
            byte[] bytes = byteArrayOutputStream.toByteArray();

            Entity channelMap = new Entity("ChannelPool", "Map");
            Blob blob = new Blob(bytes);
            channelMap.setProperty("binary", blob);
            datastoreService.put(channelMap);


            Entity entity = datastoreService.get(channelMap.getKey());
            System.out.println(entity);
            Blob property = (Blob) entity.getProperty("binary");
            byte[] blobChannelBytes = property.getBytes();

            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(blobChannelBytes);
            objectInputStream = new ObjectInputStream(byteArrayInputStream);
            HashMap<String, Channel> desChannelPool = (HashMap<String, Channel>) objectInputStream.readObject();
            System.out.println("Deserialized channel pool");
            ChannelPool.printMap(desChannelPool);
        } catch (Exception e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
    }

}
