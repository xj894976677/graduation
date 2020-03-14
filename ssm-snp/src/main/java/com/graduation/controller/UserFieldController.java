package com.graduation.controller;

import com.alibaba.fastjson.JSONObject;
import com.graduation.common.AssembleResponseMsg;
import com.graduation.http_model.ResponseBody;
import com.graduation.model.UserField;
import com.graduation.service_api.IUserFieldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserFieldController {
    @Autowired
    private IUserFieldService userFieldService;

    @RequestMapping(value = "/queryField",produces = "application/json;charset=utf-8")
    public ResponseBody queryField(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            UserField userField = userFieldService.queryField(map);
            String userFieldStr = JSONObject.toJSONString(userField);
            System.out.println(userFieldStr);
            all.put("field", userFieldStr);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","用户名或密码错误");
        }
    }

    @RequestMapping(value = "/addField",produces = "application/json;charset=utf-8")
    public ResponseBody addField(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            userFieldService.addField(map);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","用户名或密码错误");
        }
    }

    @RequestMapping(value = "/updateField",produces = "application/json;charset=utf-8")
    public ResponseBody updateField(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            userFieldService.updateField(map);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","用户名或密码错误");
        }
    }
}
