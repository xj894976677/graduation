package com.graduation.mapper_api;

import java.util.List;
import java.util.Map;

public interface FollowMapper {
    Integer isfollowing(Map<String,Object> map);
    Integer queryfansNum(Map<String,Object> map);
    Integer queryfollowNum(Map<String,Object> map);
    List<String> queryfans(Map<String,Object> map);
    List<String> queryfollow(Map<String,Object> map);
    void addfollow(Map<String,Object> map);
    void delfollow(Map<String,Object> map);
}
