package com.graduation.common;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 功能描述：日期工具类
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/12
 * @Description:cn.xueden.common
 * @version:1.0
 */
public class DateUtil {
    /**
     * 返回字符串形式的当前日期
     * @Author 学灯网
     * @Param [pattern]  模板参数  如："yyyy-MM-dd"
     * @return java.lang.String
     **/
    public static String getCurrentDateStr(String pattern){
        SimpleDateFormat format=new SimpleDateFormat(pattern);
        String currentDateStr = format.format(new Date());
        return currentDateStr;
    }
}
