package com.graduation.mapper_api;

import com.graduation.model.MailCode;

import java.util.Map;

public interface MailMapper {
    Integer mailExistence(Map<String,Object> map);
    void addNewMail(Map<String,Object> map);
    void updateCode(Map<String,Object> map);
    MailCode selectMailCode(Map<String,Object> map);
}
