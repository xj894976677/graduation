package com.graduation.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.graduation.common.AssembleResponseMsg;
import com.graduation.http_model.ResponseBody;
import com.graduation.mapper_api.ThumbMapper;
import com.graduation.model.UserInformation;
import com.graduation.model.UserSay;
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

    @RequestMapping(value = "/addSay",produces = "application/json;charset=utf-8")
    public ResponseBody addSay(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
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
            List<String> ThumbtextId = thumbService.thumbFromId(map);
            for (int i = 0; i < userSays.size(); ++i){
                for (String textId: ThumbtextId){
                    if (userSays.get(i).getTextId().toString().equals(textId)){
                        userSays.get(i).setIsThumb("1");
                        break;
                    }else {
                        userSays.get(i).setIsThumb("0");
                    }
                }
            }
            System.out.println(userSays);
            all.put("sayList", JSON.toJSONString(userSays));
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","获取微博数量失败");
        }
    }
}
