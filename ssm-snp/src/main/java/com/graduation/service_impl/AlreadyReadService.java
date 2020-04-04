package com.graduation.service_impl;

import com.graduation.mapper_api.AlreadyReadMapper;
import com.graduation.service_api.IAlreadyReadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
@Service
public class AlreadyReadService implements IAlreadyReadService {
    @Autowired
    private AlreadyReadMapper alreadyReadMapper;
    @Override
    public List<Integer> queryAlready(Map<String, Object> map) {
        return alreadyReadMapper.queryAlready(map);
    }

    @Override
    public void addAlready(Map<String, Object> map) {
        alreadyReadMapper.addAlready(map);
    }
}
