package com.graduation.service_impl;

import com.graduation.mapper_api.FollowMapper;
import com.graduation.service_api.IFollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class FollowService implements IFollowService{
    @Autowired
    private FollowMapper followMapper;

    @Override
    public Integer isfollowing(Map<String, Object> map) {
        return followMapper.isfollowing(map);
    }

    @Override
    public Integer queryfansNum(Map<String, Object> map) {

        return followMapper.queryfansNum(map);
    }

    @Override
    public Integer queryfollowNum(Map<String, Object> map) {
        return followMapper.queryfollowNum(map);
    }

    @Override
    public List<String> queryfans(Map<String, Object> map) {
        return followMapper.queryfans(map);
    }

    @Override
    public List<String> queryfollow(Map<String, Object> map) {
        return followMapper.queryfollow(map);
    }

    @Override
    public void addfollow(Map<String, Object> map) {
        followMapper.addfollow(map);
    }

    @Override
    public void delfollow(Map<String, Object> map) {
        followMapper.delfollow(map);
    }
}
