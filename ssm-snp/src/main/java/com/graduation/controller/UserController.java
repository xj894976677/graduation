package com.graduation.controller;

import com.alibaba.fastjson.JSON;
import com.graduation.common.AssembleResponseMsg;
import com.graduation.common.DateUtil;
import com.graduation.common.TLSSigAPIv2;
import com.graduation.http_model.ResponseBody;
import com.graduation.model.MailCode;
import com.graduation.model.UserField;
import com.graduation.model.UserInformation;
import com.graduation.model.UserSayNum;
import com.graduation.service_api.IMailService;
import com.graduation.service_api.IUserFieldService;
import com.graduation.service_api.IUserSayService;
import com.graduation.service_api.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private IMailService mailService;
    @Autowired
    private IUserService userService;
    @Autowired
    private IUserFieldService userFieldService;
    @Autowired
    private IUserSayService userSayService;

    @RequestMapping(value = "/login",produces = "application/json;charset=utf-8")
    public ResponseBody login(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        String userId = userService.login(map);
        if (userId != null){
            all.put("userId", userId);
            return new AssembleResponseMsg().success(all);
        }else {
            return new AssembleResponseMsg().failure(200,"error","用户名或密码错误");
        }
    }

    @RequestMapping(value = "/register",produces = "application/json;charset=utf-8")
    public ResponseBody register(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        Integer number = userService.queryUser(map);
        if (number == 0){
            try{
//                增加注册登录
                userService.addUser(map);
//                创建用户信息
                userService.addInformation(map);
//                创建用户爱好
                userFieldService.addField(map);
                return new AssembleResponseMsg().success(all);
            }catch (Exception exception){
                return new AssembleResponseMsg().failure(200,"error","注册失败,服务器错误");
            }

        }else {
            return new AssembleResponseMsg().failure(200,"error","此账户已被注册");
        }
    }

    @RequestMapping(value = "/userInformation",produces = "application/json;charset=utf-8")
    public ResponseBody userInformation(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        UserInformation userInformation = userService.userInformation(map);
        if (userInformation != null){
            System.out.println("11111111111111111111111111");
            System.out.println(userInformation);
            all.put("userId", userInformation.getUserId());
            all.put("userName", userInformation.getUserName());
            all.put("mail", userInformation.getMail());
            all.put("telephone", userInformation.getTelephone());
            all.put("sex", userInformation.getSex());
            all.put("headUrl", userInformation.getHeadUrl());
            all.put("birthday", userInformation.getBirthday().toString());
            all.put("synopsis", userInformation.getSynopsis());
            TLSSigAPIv2 tlsSigAPIv2 = new TLSSigAPIv2(1400341324, "cb4f000d17f071fe098354f0f38b8e1f1505677f87715037df4fa0876cbb6c0b");
            all.put("userSig", tlsSigAPIv2.genSig(userInformation.getUserId(), 604800));
            return new AssembleResponseMsg().success(all);
        }else {
            return new AssembleResponseMsg().failure(200,"error","没有此用户");
        }
    }

    @RequestMapping(value = "/userObj",produces = "application/json;charset=utf-8")
    public ResponseBody userObj(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        UserInformation userInformation = userService.userInformation(map);
        if (userInformation != null){
            all.put("userObj", JSON.toJSONString(userInformation));
            return new AssembleResponseMsg().success(all);
        }else {
            return new AssembleResponseMsg().failure(200,"error","没有此用户");
        }
    }
//      关闭此接口，容易被非法攻击
//    @RequestMapping(value = "/updateMail",produces = "application/json;charset=utf-8")
//    public ResponseBody updateMail(@RequestBody Map<String,Object> map) {
//        Map<String, String> all = new HashMap<>();
//        try {
//            userService.updateMail(map);
//        } catch (Exception e) {
//            return new AssembleResponseMsg().failure(200, "error", "邮箱更新出错，请重试");
//        }
//        return new AssembleResponseMsg().success(all);
//    }

    @RequestMapping(value = "/queryMail",produces = "application/json;charset=utf-8")
    public ResponseBody queryMail(@RequestBody Map<String,Object> map) {
        Map<String, String> all = new HashMap<>();
        Integer number = userService.queryMail(map);
        if (number == 0){
            return new AssembleResponseMsg().success(all);
        }else {
            return new AssembleResponseMsg().failure(200, "error", "邮箱已注册，请更换邮箱");
        }
    }

    @RequestMapping(value = "/userIdfromMail",produces = "application/json;charset=utf-8")
    public ResponseBody userIdfromMail(@RequestBody Map<String,Object> map) {
        Map<String, String> all = new HashMap<>();
        String userId = userService.userIdfromMail(map);
        if (userId != null){
            all.put("userId", userId);
            return new AssembleResponseMsg().success(all);
        }else {
            return new AssembleResponseMsg().failure(200, "error", "此邮箱未绑定用户");
        }
    }
    @RequestMapping(value = "/mailfromUserId",produces = "application/json;charset=utf-8")
    public ResponseBody mailfromUserId(@RequestBody Map<String,Object> map) {
        Map<String, String> all = new HashMap<>();
        String mail = userService.mailfromUserId(map);
        if (mail != null){
            all.put("mail", mail);
            return new AssembleResponseMsg().success(all);
        }else {
            return new AssembleResponseMsg().failure(200, "error", "此用户未绑定邮箱，无法进行此操作");
        }
    }
//    更改用户信息接口
    @RequestMapping(value = "/changeInformation",produces = "application/json;charset=utf-8")
    public ResponseBody changeInformation(@RequestBody Map<String,Object> map) {
        Map<String, String> all = new HashMap<>();
        try {
            userService.updateInformation(map);
            userFieldService.updateField(map);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200, "error", "更新失败");
        }
        return new AssembleResponseMsg().success(all);
    }

    //    更改用户信息接口
    @RequestMapping(value = "/bandmail",produces = "application/json;charset=utf-8")
    public ResponseBody bandmail(@RequestBody Map<String,Object> map) {
        Map<String,String> all = new HashMap<>();
        MailCode mailCode = mailService.selectMailCode(map);
        String code = (String) map.get("code");
        if (code == null){
            return new AssembleResponseMsg().failure(200,"error","验证码为空");
        }
        if (code.equals(mailCode.getCode()) && DateUtil.compareWithCurrent(mailCode.getExpirationDate())){
            try{
                userService.bandmail(map);
            }catch (Exception e){
                return new AssembleResponseMsg().failure(200,"error","绑定失败");
            }
            return new AssembleResponseMsg().success(all);
        }else if (!code.equals(mailCode.getCode())){
            return new AssembleResponseMsg().failure(200,"error","验证码不一致");
        }else{
            return new AssembleResponseMsg().failure(200,"error","验证码已过期");
        }
    }

    @RequestMapping(value = "/RecommendedFriend",produces = "application/json;charset=utf-8")
    public ResponseBody RecommendedFriend(@RequestBody Map<String,Object> map) throws IllegalAccessException {
        Map<String, String> all = new HashMap<>();
        UserField userField = userFieldService.queryField(map);
        String fieldStr = userField.getFunny().toString() + userField.getAnime().toString() + userField.getNews().toString() + userField.getFashion().toString() + userField.getMotion().toString() + userField.getScience().toString();
        UserSayNum userSayNum = userSayService.userSayNum(map);
        String field = "total";
        Integer max = 0;
        if (userSayNum == null){
            userSayNum = new UserSayNum();
            userSayNum.setScience(0);
            userSayNum.setMotion(0);
            userSayNum.setFashion(0);
            userSayNum.setNews(0);
            userSayNum.setAnime(0);
            userSayNum.setFunny(0);
        }
        Class cls = userSayNum.getClass();
        Field[] fields = cls.getDeclaredFields();
        for (int i = 0; i < fields.length; ++i){
            Field f = fields[i];
            f.setAccessible(true);
            if (f.getName() != "userId" && f.getName() != "total"){
                if (Integer.parseInt(f.get(userSayNum).toString()) > max){
                    max = Integer.parseInt(f.get(userSayNum).toString());
                    field = f.getName();
                }
            }
        }
//        if (userSayNum.getFunny() > max){
//            max = userSayNum.getFunny();
//            field = "funny";
//        }
        map.put("field", field);
        map.put("fieldStr", fieldStr);
        List<String> s = userService.RecommendedFriend(map);
        all.put("userList", JSON.toJSONString(s));
        return new AssembleResponseMsg().success(all);
    }
}
