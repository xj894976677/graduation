package com.graduation.dao;

import com.graduation.pojo.User;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {
//    查询测试
    public User queryUser(@Param("userId") String id);
}
