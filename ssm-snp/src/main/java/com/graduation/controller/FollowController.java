package com.graduation.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.graduation.common.AssembleResponseMsg;
import com.graduation.http_model.ResponseBody;
import com.graduation.model.UserInformation;
import com.graduation.service_api.IFollowService;
import com.graduation.service_api.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class FollowController {
    @Autowired
    private IFollowService followService;
    @Autowired
    private IUserService userService;

    @RequestMapping(value = "/followIm",produces = "application/json;charset=utf-8")
    public ResponseBody followIm(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            Integer isfollowing = followService.isfollowing(map);
            all.put("isfollowing", Integer.toString(isfollowing));
            Integer fans = followService.queryfansNum(map);
            all.put("fans", Integer.toString(fans));
            Integer follow = followService.queryfollowNum(map);
            all.put("follow", Integer.toString(follow));
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","查询粉丝数量失败");
        }
    }

    @RequestMapping(value = "/isfollowing",produces = "application/json;charset=utf-8")
    public ResponseBody isfollowing(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            Integer num = followService.isfollowing(map);
            all.put("num", Integer.toString(num));
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","查询粉丝数量失败");
        }
    }

    @RequestMapping(value = "/queryfansNum",produces = "application/json;charset=utf-8")
    public ResponseBody queryfansNum(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            Integer num = followService.queryfansNum(map);
            all.put("num", Integer.toString(num));
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","查询粉丝数量失败");
        }
    }

    @RequestMapping(value = "/queryfollowNum",produces = "application/json;charset=utf-8")
    public ResponseBody queryfollowNum(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            Integer num = followService.queryfollowNum(map);
            all.put("num", Integer.toString(num));
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","查询关注数量失败");
        }
    }

    @RequestMapping(value = "/queryfans",produces = "application/json;charset=utf-8")
    public ResponseBody queryfans(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            List<String> fans = followService.queryfans(map);
            String fansStr = JSON.toJSONString(fans);
            all.put("fans", fansStr);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","获取粉丝信息失败");
        }
    }

    @RequestMapping(value = "/queryfollow",produces = "application/json;charset=utf-8")
    public ResponseBody queryfollow(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            List<String> follow = followService.queryfollow(map);
            String fansStr = JSON.toJSONString(follow);
            all.put("follow", fansStr);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","获取关注用户失败");
        }
    }

    @RequestMapping(value = "/addfollow",produces = "application/json;charset=utf-8")
    public ResponseBody addfollow(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            followService.addfollow(map);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","关注失败");
        }
        return new AssembleResponseMsg().success(all);
    }

    @RequestMapping(value = "/delfollow",produces = "application/json;charset=utf-8")
    public ResponseBody delfollow(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try {
            followService.delfollow(map);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","取关失败");
        }
        return new AssembleResponseMsg().success(all);
    }

    @RequestMapping(value = "/queryFollowMessage",produces = "application/json;charset=utf-8")
    public ResponseBody queryFollowMessage(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            List<String> follow = followService.queryfollow(map);
            List<UserInformation> followInformation = new ArrayList<>(10);
            for (String userId: follow){
                Map<String,Object> temp = new HashMap<>();
                temp.put("userId", userId);
                UserInformation userInformation =  userService.userInformation(temp);
                followInformation.add(userInformation);
            }
            String fansStr = JSON.toJSONString(followInformation);
            all.put("follow", fansStr);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","获取关注用户失败");
        }
    }
}
