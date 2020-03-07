package com.graduation.service_api;

import java.util.Map;

/**
 * 功能描述：系统访问日志接口
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/17
 * @Description:cn.xueden.service
 * @version:1.0
 */
public interface ISysAccessLogService {

    //保存日志
    public int saveSysLog(Map<String,Object> map);

    //查看日志列表
    public Map<String,Object> querySysLogList(Map<String,Object> map);
}
