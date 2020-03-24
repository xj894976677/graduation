package com.graduation.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.graduation.common.AssembleResponseMsg;
import com.graduation.http_model.ResponseBody;
import com.graduation.mapper_api.ThumbMapper;
import com.graduation.model.UserInformation;
import com.graduation.model.UserSay;
import com.graduation.model.UserSayNum;
import com.graduation.service_api.IFollowService;
import com.graduation.service_api.IThumbService;
import com.graduation.service_api.IUserSayService;
import com.graduation.service_api.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserSayController {
    @Autowired
    private IUserSayService userSayService;
    @Autowired
    private IThumbService thumbService;
    @Autowired
    private IFollowService followService;
    @Autowired
    private IUserService userService;

    @RequestMapping(value = "/addSay",produces = "application/json;charset=utf-8")
    public ResponseBody addSay(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            UserSayNum userSayNum = userSayService.userSayNum(map);
            if (userSayNum == null){
                System.out.println("为空");
                userSayService.addSayNum(map);
                userSayNum = userSayService.userSayNum(map);
            }
            userSayNum.setTotal(userSayNum.getTotal() + 1);
            if ("funny".equals(map.get("field"))){
                Integer num = userSayNum.getFunny();
                userSayNum.setFunny(num + 1);
            }
            if ("anime".equals(map.get("field"))){
                Integer num = userSayNum.getAnime();
                userSayNum.setAnime(num + 1);
            }
            if ("news".equals(map.get("field"))){
                Integer num = userSayNum.getNews();
                userSayNum.setNews(num + 1);
            }
            if ("fashion".equals(map.get("field"))){
                Integer num = userSayNum.getFashion();
                userSayNum.setFashion(num + 1);
            }
            if ("motion".equals(map.get("field"))){
                Integer num = userSayNum.getMotion();
                userSayNum.setMotion(num + 1);
            }
            if ("science".equals(map.get("field"))){
                Integer num = userSayNum.getScience();
                userSayNum.setScience(num + 1);
            }
            userSayService.updateSayNum(userSayNum);
            userSayService.addSay(map);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","发表失败");
        }
    }

    @RequestMapping(value = "/sayNum",produces = "application/json;charset=utf-8")
    public ResponseBody sayNum(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            all.put("num", userSayService.sayNum(map).toString());
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","获取微博数量失败");
        }
    }

    @RequestMapping(value = "/allsay",produces = "application/json;charset=utf-8")
    public ResponseBody allsay(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            List<UserSay> userSays = userSayService.allsay(map);
            if (map.get("loginUser") != null){
                map.put("userId", map.get("loginUser"));
            }
            List<String> ThumbtextId = thumbService.thumbFromId(map);
            userSays = userSayService.addThumb(userSays, ThumbtextId);
            for (int i = 0; i < userSays.size(); ++i){
                HashMap map1 = new HashMap();
                map1.put("userId", userSays.get(i).getUserId());
                UserInformation userInformation = userService.userInformation(map1);
                userSays.get(i).setUserName(userInformation.getUserName());
                userSays.get(i).setUserUrl(userInformation.getHeadUrl());
            }
            System.out.println(userSays);
            all.put("sayList", JSON.toJSONString(userSays));
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","获取微博数量失败");
        }
    }

    @RequestMapping(value = "/followsay",produces = "application/json;charset=utf-8")
    public ResponseBody followsay(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            List<String> follow = followService.queryfollow(map);
            List<String> ThumbtextId = thumbService.thumbFromId(map);
            map.put("list", follow);
            if (follow.size() == 0){
                return new AssembleResponseMsg().success(all);
            }
            List<UserSay> userSays = userSayService.sayFromList(map);
            userSays = userSayService.addThumb(userSays, ThumbtextId);
            for (int i = 0; i < userSays.size(); ++i){
                HashMap map1 = new HashMap();
                map1.put("userId", userSays.get(i).getUserId());
                UserInformation userInformation = userService.userInformation(map1);
                userSays.get(i).setUserUrl(userInformation.getHeadUrl());
                userSays.get(i).setUserName(userInformation.getUserName());
            }
            all.put("sayList", JSON.toJSONString(userSays));
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","获取微博数量失败");
        }
    }

    @RequestMapping(value = "/recommend",produces = "application/json;charset=utf-8")
    public ResponseBody recommend(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
//            List<String> follow = followService.queryfollow(map);
            List<String> ThumbtextId = thumbService.thumbFromId(map);
//            map.put("list", follow);
//            if (follow.size() == 0){
//                return new AssembleResponseMsg().success(all);
//            }
            HashMap map1 = new HashMap();
            List<UserSay> userSays = userSayService.recommend(map);
            userSays = userSayService.addThumb(userSays, ThumbtextId);
            for (int i = 0; i < userSays.size(); ++i){
                map1.put("userId", userSays.get(i).getUserId());
                UserInformation userInformation = userService.userInformation(map1);
                userSays.get(i).setUserName(userInformation.getUserName());
                userSays.get(i).setUserUrl(userInformation.getHeadUrl());
            }
            all.put("recommend", JSON.toJSONString(userSays));
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","获取微博数量失败");
        }
    }
}
