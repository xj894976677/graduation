package com.graduation.service_api;

import java.util.Map;

/**
 * 功能描述：用户业务层接口
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/12
 * @Description:cn.xueden.service.impl
 * @version:1.0
 */
public interface IUserServicetest {


    //查询用户列表
    Map<String,Object> queryUserList(Map<String,Object> map);


    int queryUser(Map<String,Object> map);

    //新增用户
    void addUser(Map<String,Object> map);

    //根据用户名更改用户信息
    void updateUser(Map<String,Object> map);

    //根据用户ID更改用户信息
    void updateUserById(Map<String,Object> map);

    //删除用户
    void delUser(Map<String,Object> map);

    //修改用户密码
    void updateUserPass(Map<String,Object> map);
}
