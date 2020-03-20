package com.graduation.controller;

import com.graduation.common.AssembleResponseMsg;
import com.graduation.http_model.ResponseBody;
import com.graduation.service_api.IThumbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ThumbController {
    @Autowired
    private IThumbService iThumbService;

    @RequestMapping(value = "/addThumb",produces = "application/json;charset=utf-8")
    public ResponseBody addThumb(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            iThumbService.addThumb(map);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","发表失败");
        }
    }

    @RequestMapping(value = "/delThumb",produces = "application/json;charset=utf-8")
    public ResponseBody delThumb(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            iThumbService.delThumb(map);
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","发表失败");
        }
    }

    @RequestMapping(value = "/isThumb",produces = "application/json;charset=utf-8")
    public ResponseBody isThumb(@RequestBody Map<String,Object> map){
        Map<String,String> all = new HashMap<>();
        try{
            Integer num = iThumbService.isThumb(map);
            all.put("num", num.toString());
            return new AssembleResponseMsg().success(all);
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","发表失败");
        }
    }
}
