package com.graduation.controller;

import com.graduation.common.AssembleResponseMsg;
import com.graduation.model.ResponseBody;
import com.graduation.service_api.IUserService1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class Usertest {
    @Autowired
    private IUserService1 userService1;

    @RequestMapping(value = "/queryUser1",produces = "application/json;charset=utf-8")
    public ResponseBody queryUser(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        all.put("status",userService1.queryName(map));
        return new AssembleResponseMsg().success(all);
    }
}
