package com.graduation.mapper_api;

import com.graduation.model.UserSay;
import com.graduation.model.UserSayNum;

import java.util.List;
import java.util.Map;

public interface UserSayMapper {
    public void addSay(UserSay userSay);
    List<UserSay> allsay(Map<String,Object> map);
    public void delsay (Map<String,Object> map);
    Integer sayNum(Map<String,Object> map);
    UserSayNum userSayNum(Map<String,Object> map);
    void updateSayNum(UserSayNum userSayNum);
    void addSayNum(Map<String,Object> map);
    Integer thumbNum(Map<String,Object> map);
    void updateThumb(Map<String,Object> map);
    List<UserSay> sayFromList(Map<String,Object> map);
}
