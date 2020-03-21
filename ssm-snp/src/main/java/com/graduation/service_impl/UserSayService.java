package com.graduation.service_impl;

import com.graduation.common.DateUtil;
import com.graduation.mapper_api.UserSayMapper;
import com.graduation.model.UserSay;
import com.graduation.model.UserSayNum;
import com.graduation.service_api.IUserSayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
@Service
public class UserSayService implements IUserSayService {
    @Autowired
    private UserSayMapper userSayMapper;
    @Override
    public void addSay(Map<String, Object> map) {
        UserSay userSay = new UserSay();
        userSay.setUserId((String) map.get("userId"));
        userSay.setUserName((String) map.get("userName"));
        userSay.setText((String) map.get("text"));
        userSay.setAddress((String) map.get("address"));
        userSay.setDiscuss(0);
        userSay.setThumb(0);
        userSay.setPicUrl((String) map.get("picUrl"));
        userSay.setSayType((String) map.get("field"));
        userSay.setMoment(DateUtil.getSqlStamp());
        userSay.setUserUrl("");
        userSayMapper.addSay(userSay);
    }

    @Override
    public List<UserSay> allsay(Map<String, Object> map) {
        return userSayMapper.allsay(map);
    }

    @Override
    public void delsay(Map<String, Object> map) {
        userSayMapper.delsay(map);
    }

    @Override
    public Integer sayNum(Map<String, Object> map) {
        return userSayMapper.sayNum(map);
    }

    @Override
    public UserSayNum userSayNum(Map<String, Object> map) {
        return userSayMapper.userSayNum(map);
    }

    @Override
    public void updateSayNum(UserSayNum userSayNum) {
        userSayMapper.updateSayNum(userSayNum);
    }

    @Override
    public void addSayNum(Map<String, Object> map) {
        userSayMapper.addSayNum(map);
    }

    @Override
    public Integer thumbNum(Map<String, Object> map) {
        return userSayMapper.thumbNum(map);
    }

    @Override
    public void updateThumb(Map<String, Object> map) {
        userSayMapper.updateThumb(map);
    }
}
