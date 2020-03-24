package com.graduation.service_impl;

import com.graduation.mapper_api.DiscussMapper;
import com.graduation.model.Discuss;
import com.graduation.service_api.IDiscussService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DiscussService implements IDiscussService {
    @Autowired
    private DiscussMapper discussMapper;
    @Override
    public List<Discuss> queryDiscuss(Map<String, Object> map) {
        return discussMapper.queryDiscuss(map);
    }

    @Override
    public void addDiscuss(Map<String, Object> map) {
        discussMapper.addDiscuss(map);
    }
}
