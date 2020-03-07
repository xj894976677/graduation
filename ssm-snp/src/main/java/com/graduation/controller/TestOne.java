package com.graduation.controller;

import com.graduation.common.AssembleResponseMsg;
import com.graduation.model.ResponseBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class TestOne {
    @RequestMapping(value = "/test",produces = "application/json;charset=utf-8")
    public ResponseBody queryBookList(){
        Map<String,Object> resultMap = new HashMap<String, Object>();
        resultMap.put("ok", "ok");
        return new AssembleResponseMsg().success(resultMap);
    }
}
