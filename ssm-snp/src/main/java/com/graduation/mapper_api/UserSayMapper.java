package com.graduation.mapper_api;

import com.graduation.model.UserSay;

import java.util.List;
import java.util.Map;

public interface UserSayMapper {
    public void addSay(UserSay userSay);
    List<UserSay> allsay(Map<String,Object> map);
    public void delsay (Map<String,Object> map);
    Integer sayNum(Map<String,Object> map);
}
