package com.graduation.mapper_api;

import java.util.List;
import java.util.Map;

public interface ThumbMapper {
    void addThumb(Map<String,Object> map);
    void delThumb(Map<String,Object> map);
    Integer isThumb(Map<String,Object> map);
    List<String> thumbFromId(Map<String,Object> map);
}
