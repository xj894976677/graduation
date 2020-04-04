package com.graduation.service_api;

import java.util.List;
import java.util.Map;

public interface IAlreadyReadService {
    List<Integer> queryAlready(Map<String,Object> map);
    void addAlready(Map<String,Object> map);
}
