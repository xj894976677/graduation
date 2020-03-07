package com.graduation.service_impl;

import com.graduation.mapper_api.UserMapper;
import com.graduation.service_api.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserMapper userMapper;
    @Override
    public String login(Map<String, Object> map) {
        return userMapper.login(map);
    }
}
