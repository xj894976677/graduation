package com.graduation.controller;

import com.graduation.service.UserService;
import com.graduation.service_api.Userservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    @Qualifier("UserServiceImpl")
    private UserService userService;
    @RequestMapping(value = "/queryuser",produces = "application/json;charset=utf-8")
    public String list(@RequestBody Map<String,Object> map){

    }
}
