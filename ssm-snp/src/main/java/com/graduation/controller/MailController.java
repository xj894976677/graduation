package com.graduation.controller;

import com.graduation.common.AssembleResponseMsg;
import com.graduation.common.DateUtil;
import com.graduation.common.MailUtil;
import com.graduation.model.MailCode;
import com.graduation.model.ResponseBody;
import com.graduation.service_api.IMailService;
import com.graduation.service_api.IUserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class MailController {
    @Autowired
    private IMailService mailService;
    @Autowired
    private IUserService userService;

    @RequestMapping(value = "/mailcode",produces = "application/json;charset=utf-8")
    public ResponseBody sendcode(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        Integer number = mailService.mailExistence(map);
        if (number == 0){
            mailService.addNewMail(map);
        }
        try {
            String mail = (String) map.get("mail");
            String code= RandomStringUtils.randomAlphanumeric(6);
            map.put("code", code);
            String expirationDate = DateUtil.getStrTimeStamp(+2);
            map.put("expirationDate", expirationDate);
            mailService.updateCode(map);
            MailUtil.sendEmail(mail, code);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","发送失败，请重试");
        }
        return new AssembleResponseMsg().success(all);
    }

    @RequestMapping(value = "/checkCode",produces = "application/json;charset=utf-8")
    public ResponseBody checkCode(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        MailCode mailCode = mailService.selectMailCode(map);
        String code = (String) map.get("code");
        if (code == null){
            return new AssembleResponseMsg().failure(200,"error","验证码为空");
        }
        if (code.equals(mailCode.getCode()) && DateUtil.compareWithCurrent(mailCode.getExpirationDate())){
            return new AssembleResponseMsg().success(all);
        }else if (!code.equals(mailCode.getCode())){
            return new AssembleResponseMsg().failure(200,"error","验证码不一致");
        }else{
            return new AssembleResponseMsg().failure(200,"error","验证码已过期");
        }
    }

    @RequestMapping(value = "/resetPassword",produces = "application/json;charset=utf-8")
    public ResponseBody codeSame(@RequestBody Map<String,Object> map){
        String code = (String) map.get("code");
        if (code == null){
            return new AssembleResponseMsg().failure(200,"error","验证码为空");
        }
        MailCode mailCode = mailService.selectMailCode(map);
        if (code.equals(mailCode.getCode())){
            userService.updatePassword(map);
            Map<String,String> all = new HashMap<>();
            return new AssembleResponseMsg().success(all);
        }else{
            return new AssembleResponseMsg().failure(200,"error","验证码不一致");
        }
    }

    @RequestMapping(value = "/checkNewMailCode",produces = "application/json;charset=utf-8")
    public ResponseBody checkNewMailCode(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        Map<String,Object> previous = new LinkedHashMap<>();
        Map<String,Object> now = new LinkedHashMap<>();
        previous.put("mail", map.get("previousmail"));
        previous.put("code", map.get("previouscode"));
        now.put("mail", map.get("mail"));
        now.put("code", map.get("code"));
        MailCode previousMail = mailService.selectMailCode(previous);
        MailCode nowMail = mailService.selectMailCode(now);
        String previousCode = (String) map.get("previouscode");
        String nowCode = (String) map.get("code");

        if (previousCode == null){
            return new AssembleResponseMsg().failure(200,"error","前台流程错误");
        }
        if (nowCode == null){
            return new AssembleResponseMsg().failure(200,"error","验证码为空");
        }
        if (!previousCode.equals(previousMail.getCode())){
            return new AssembleResponseMsg().failure(200,"error","原邮箱验证码错误，疑似黑客攻击");
        }
        if (nowCode.equals(nowMail.getCode()) && DateUtil.compareWithCurrent(nowMail.getExpirationDate())){
            userService.updateMail(map);
            return new AssembleResponseMsg().success(all);
        }
        if (!nowMail.equals(nowMail.getCode())){
            return new AssembleResponseMsg().failure(200,"error","验证码不一致");
        }else{
            return new AssembleResponseMsg().failure(200,"error","验证码已过期");
        }
    }
}
