package com.graduation.common;

import java.util.UUID;

/**
 * 功能描述：各种ID工具类
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/17
 * @Description:cn.xueden.common
 * @version:1.0
 */
public class IDUtil {

    /**
     * 功能描述：获取uuid（以去掉'-'字符）
     * @return
     */
    public static String getUUID(){
        return UUID.randomUUID().toString().replace("-", "");
    }
}
