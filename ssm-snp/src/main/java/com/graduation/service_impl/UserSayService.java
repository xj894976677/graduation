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

    @Override
    public List<UserSay> sayFromList(Map<String,Object> map) {
        return userSayMapper.sayFromList(map);
    }
    @Override
    public List<UserSay> addThumb(List<UserSay> userSays, List<String> ThumbtextId){
        for (int i = 0; i < userSays.size(); ++i){
            for (String textId: ThumbtextId){
                if (userSays.get(i).getTextId().toString().equals(textId)){
                    userSays.get(i).setIsThumb("1");
                    break;
                }else {
                    userSays.get(i).setIsThumb("0");
                }
            }
            if (ThumbtextId.size() == 0){
                userSays.get(i).setIsThumb("0");
            }
        }
        return userSays;
    }

    @Override
    public Integer discussNum(Map<String, Object> map) {
        return userSayMapper.discussNum(map);
    }

    @Override
    public void updateDiscuss(Map<String, Object> map) {
        userSayMapper.updateDiscuss(map);
    }

    @Override
    public List<UserSay> recommend(Map<String, Object> map) {
        return userSayMapper.recommend(map);
    }

    @Override
    public List<UserSay> recommendS(Map<String, Object> map) {
        return userSayMapper.recommendS(map);
    }
}
