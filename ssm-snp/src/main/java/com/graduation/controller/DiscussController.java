package com.graduation.controller;

import com.alibaba.fastjson.JSON;
import com.graduation.common.AssembleResponseMsg;
import com.graduation.common.DateUtil;
import com.graduation.http_model.ResponseBody;
import com.graduation.model.Discuss;
import com.graduation.model.UserInformation;
import com.graduation.service_api.IDiscussService;
import com.graduation.service_api.IUserSayService;
import com.graduation.service_api.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
public class DiscussController {
    @Autowired
    private IDiscussService discussService;
    @Autowired
    private IUserService userService;
    @Autowired
    private IUserSayService userSayService;

    @RequestMapping(value = "/queryDiscuss",produces = "application/json;charset=utf-8")
    public ResponseBody queryDiscuss(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            List<Discuss> list = discussService.queryDiscuss(map);
            for (int i = 0; i < list.size(); ++i){
                map.put("userId", list.get(i).getSayUserId());
                UserInformation userInformation = userService.userInformation(map);
                list.get(i).setUserName(userInformation.getUserName());
                list.get(i).setPicUrl(userInformation.getHeadUrl());
            }
            String json = JSON.toJSONString(list);
            all.put("discuss", json);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","查询粉丝数量失败");
        }
    }
    @RequestMapping(value = "/addDiscuss",produces = "application/json;charset=utf-8")
    public ResponseBody addDiscuss(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            map.put("moment", DateUtil.getSqlStamp());
            discussService.addDiscuss(map);
            Integer num = userSayService.discussNum(map);
            map.put("discuss", num + 1);
            userSayService.updateDiscuss(map);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","查询粉丝数量失败");
        }
    }
}
