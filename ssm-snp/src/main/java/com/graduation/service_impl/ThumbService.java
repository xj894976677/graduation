package com.graduation.service_impl;

import com.graduation.mapper_api.ThumbMapper;
import com.graduation.service_api.IThumbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
@Service
public class ThumbService implements IThumbService {
    @Autowired
    private ThumbMapper thumbMapper;

    @Override
    public void addThumb(Map<String, Object> map) {
        thumbMapper.addThumb(map);
    }

    @Override
    public void delThumb(Map<String, Object> map) {
        thumbMapper.delThumb(map);
    }

    @Override
    public Integer isThumb(Map<String, Object> map) {
        return thumbMapper.isThumb(map);
    }

    @Override
    public List<String> thumbFromId(Map<String, Object> map) {
        return thumbMapper.thumbFromId(map);
    }
}
