package com.graduation.controller;

import com.graduation.common.AssembleResponseMsg;
import com.graduation.http_model.ResponseBody;
import com.graduation.service_api.ISysAccessLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 功能描述：日志管理的控制层
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/17
 * @Description:cn.xueden.controller
 * @version:1.0
 */

@RestController
public class SysAccessLogController {

    @Autowired
    private ISysAccessLogService sysAccessLogService;

    /**
     * 功能描述：查看日志列表
     * @param map
     * @return
     */
    @RequestMapping(value = "/querySysLogList",produces = "application/json;charset=utf-8")
    public ResponseBody querySysLogList(@RequestBody Map<String,Object> map){
        Map<String,Object> resultMap = sysAccessLogService.querySysLogList(map);
        return new AssembleResponseMsg().success(resultMap);
    }

}
