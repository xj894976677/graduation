package com.graduation.mapper_api;

import com.graduation.model.UserField;

import java.util.Map;

public interface UserFieldMapper {
    public UserField queryField(Map<String,Object> map);
    public void addField(Map<String,Object> map);
    public void updateField(UserField userField);

}
