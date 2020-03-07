package com.graduation.common;

import eu.bitwalker.useragentutils.UserAgent;

import javax.servlet.http.HttpServletRequest;

/**
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/17
 * @Description:cn.xueden.common
 * @version:1.0
 */
public class StringUtil {

    /**
     * 功能描述：浏览器和系统信息
     * @param request
     * @return
     */
    public static String getBrowserSystemInfo(HttpServletRequest request){
        UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("user-agent"));
        String BSInfo = userAgent.getOperatingSystem() + "-" + userAgent.getBrowser() + "(" + userAgent.getBrowserVersion() + ")";
        return BSInfo;
    }
}
