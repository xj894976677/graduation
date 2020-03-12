package com.graduation.mapper_api;

import com.graduation.model.UserInformation;

import java.util.Map;

public interface UserMapper {
    String login(Map<String,Object> map);
    Integer queryUser(Map<String,Object> map);
    void addUser(Map<String,Object> map);
    void addInformation(Map<String,Object> map);
    UserInformation userInformation(Map<String,Object> map);
}
