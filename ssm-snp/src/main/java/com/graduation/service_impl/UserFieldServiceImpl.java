package com.graduation.service_impl;


import com.graduation.mapper_api.UserFieldMapper;
import com.graduation.mapper_api.UserMapper;
import com.graduation.model.UserField;
import com.graduation.service_api.IUserFieldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserFieldServiceImpl implements IUserFieldService {
    @Autowired
    private UserFieldMapper userFieldMapper;
    @Override
    public UserField queryField(Map<String, Object> map) {
        return userFieldMapper.queryField(map);
    }

    @Override
    public void addField(Map<String, Object> map) {
        userFieldMapper.addField(map);
    }

    @Override
    public void updateField(Map<String, Object> map) {
        UserField userField = new UserField();
        userField.setUserId((String) map.get("userId"));
        userField.setAnime((Integer) map.get("anime"));
        userField.setFashion((Integer) map.get("fashion"));
        userField.setMotion((Integer) map.get("motion"));
        userField.setNews((Integer) map.get("news"));
        userField.setScience((Integer) map.get("science"));
        userField.setFunny((Integer) map.get("funny"));
        userFieldMapper.updateField(userField);
    }

}
