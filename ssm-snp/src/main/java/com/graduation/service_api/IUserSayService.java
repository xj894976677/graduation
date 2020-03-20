package com.graduation.service_api;

import com.graduation.model.UserSay;

import java.util.List;
import java.util.Map;

public interface IUserSayService {
    public void addSay(Map<String, Object> map);
    List<UserSay> allsay(Map<String,Object> map);
    public void delsay (Map<String,Object> map);
    Integer sayNum(Map<String,Object> map);
}
