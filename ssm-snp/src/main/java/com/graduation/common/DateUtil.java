package com.graduation.common;

import java.text.SimpleDateFormat;
import java.util.Calendar;
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
     * @Author xj
     * @Param [pattern]  模板参数  如："yyyy-MM-dd"
     * @return java.lang.String
     **/
    public static String getCurrentDateStr(String pattern){
        SimpleDateFormat format=new SimpleDateFormat(pattern);
        String currentDateStr = format.format(new Date());
        return currentDateStr;
    }
    /**
     * 返回long形式的当前时间戳
     * @Author xj
     * @Param [pattern]  模板参数  如："yyyy-MM-dd"
     * @return
     **/
    public static long getTimeStamp(int deviation){
        Calendar beforeTime = Calendar.getInstance();
        beforeTime.add(Calendar.MINUTE, deviation);// 3分钟之前的时间
        Date time = beforeTime.getTime();
        long ts = time.getTime();
        return ts;
    }
    /**
     * 返回字符串形式的当前s时间戳
     * @Author xj
     * @Param
     * @return java.lang.String
     **/
    public static String getStrTimeStamp(int deviation){
        long ts = getTimeStamp(deviation);
        String timeStr = String.valueOf(ts);
        return timeStr;
    }
    /**
     * 传入时间与当前时间进行对比，如果大于当前时间则返回true
     * @Author xj
     * @Param
     * @return
     **/
    public static boolean compareWithCurrent(String time){
        long now = getTimeStamp(0);
        long ts = Long.parseLong(time);
        if (now <= ts){
            return true;
        }else {
            return false;
        }
    }
}
