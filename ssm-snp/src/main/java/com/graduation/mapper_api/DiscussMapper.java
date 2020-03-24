package com.graduation.mapper_api;

import com.graduation.model.Discuss;

import java.util.List;
import java.util.Map;

public interface DiscussMapper {
    List<Discuss> queryDiscuss(Map<String,Object> map);
    void addDiscuss(Map<String,Object> map);
}
