package com.graduation.service_impl;

import com.graduation.mapper_api.UserMapper1;
import com.graduation.service_api.IUserService1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
@Service
public class UserServiceImpl1 implements IUserService1 {
    @Autowired
    private UserMapper1 userMapper1;
    @Override
    public String queryName(Map<String, Object> map) {
        return userMapper1.queryName(map);
    }
}
