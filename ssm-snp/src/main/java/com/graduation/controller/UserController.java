package com.graduation.controller;

import com.graduation.common.AssembleResponseMsg;
import com.graduation.model.ResponseBody;
import com.graduation.service_api.IUserService;
import com.graduation.service_impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private IUserService userService;

    @RequestMapping(value = "/login",produces = "application/json;charset=utf-8")
    public ResponseBody queryUser(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        String userId = userService.login(map);
        if (userId != null){
            all.put("userId", userId);
            return new AssembleResponseMsg().success(all);
        }else {
            return new AssembleResponseMsg().failure(200,"error","用户名或密码错误");
        }
    }
}
