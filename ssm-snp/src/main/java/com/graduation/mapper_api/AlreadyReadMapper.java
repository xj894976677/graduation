package com.graduation.mapper_api;

import com.graduation.model.Discuss;

import java.util.List;
import java.util.Map;

public interface AlreadyReadMapper {
    List<Integer> queryAlready(Map<String,Object> map);
    void addAlready(Map<String,Object> map);
}
