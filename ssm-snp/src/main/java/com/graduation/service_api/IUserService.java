package com.graduation.service_api;

import com.graduation.model.UserInformation;

import java.util.List;
import java.util.Map;

public interface IUserService {
    String login(Map<String,Object> map);
    Integer queryUser(Map<String,Object> map);
    void addUser(Map<String,Object> map);
    void addInformation(Map<String,Object> map);
    UserInformation userInformation(Map<String,Object> map);
    void updateMail(Map<String,Object> map);
    Integer queryMail(Map<String,Object> map);
    String userIdfromMail(Map<String,Object> map);
    String mailfromUserId(Map<String,Object> map);
    void updatePassword(Map<String,Object> map);
    void updateInformation(Map<String,Object> map);
    void bandmail(Map<String,Object> map);
    List<String> RecommendedFriend(Map<String,Object> map);
}
