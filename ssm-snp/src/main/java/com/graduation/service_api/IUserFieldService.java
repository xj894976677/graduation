package com.graduation.service_api;

import com.graduation.model.UserField;

import java.util.Map;

public interface IUserFieldService {
    public UserField queryField(Map<String,Object> map);
    public void addField(Map<String,Object> map);
    public void updateField(Map<String, Object> map);
}
