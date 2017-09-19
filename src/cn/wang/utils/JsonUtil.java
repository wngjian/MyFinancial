package cn.wang.utils;

import com.google.gson.Gson;
import com.google.gson.JsonNull;

/**
 * Created by Administrator on 2017/9/13 0013.
 */
public class JsonUtil {

    private static Gson gson = new Gson();


    /**
     * @param src :将要被转化的对象
     * @return :转化后的JSON串
     * @MethodName : toJson
     * @Description : 将对象转为JSON串，此方法能够满足大部分需求
     */
    public static String toJson(Object src) {
        if (src == null) {
            return gson.toJson(JsonNull.INSTANCE);
        }
        return gson.toJson(src);
    }
}
