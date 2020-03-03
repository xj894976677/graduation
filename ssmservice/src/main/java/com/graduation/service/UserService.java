package com.graduation.service;

import com.graduation.dao.UserMapper;
import com.graduation.pojo.User;
import com.graduation.service_api.Userservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("UserServiceImpl")
public class UserService implements Userservice {
    @Autowired
    private UserMapper userMapper;
    public User queryUser(String id) {
        return userMapper.queryUser(id);
    }
}
