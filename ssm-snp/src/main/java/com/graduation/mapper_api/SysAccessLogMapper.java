package com.graduation.mapper_api;

import java.util.List;
import java.util.Map;

/**
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/17
 * @Description:cn.xueden.mapper
 * @version:1.0
 */
public interface SysAccessLogMapper {

    //保存日志
    public int saveSysLog(Map<String,Object> map);

    //查看日志列表
    public List<Map<String,Object>> querySysLogList(Map<String,Object> map);
}
