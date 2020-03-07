package com.graduation.service_impl;

import com.graduation.mapper_api.UserMappertest;
import com.graduation.model.User;
import com.graduation.service_api.IUserServicetest;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 功能描述：用户业务层实现类
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/12
 * @Description:cn.xueden.service.impl
 * @version:1.0
 */
@Service
public class UserServicetestImpl implements IUserServicetest {

    @Autowired
    private UserMappertest userMappertest;


    /**
     * 功能描述：查询用户列表
     * @param map
     * @return
     */
    @Override
    public Map<String, Object> queryUserList(Map<String, Object> map) {

        //获取当前页
        int pageNum = Integer.parseInt(map.get("pageNum").toString());
        //每页几条记录
        int pageSize = Integer.parseInt(map.get("pageSize").toString());

        PageHelper.startPage(pageNum,pageSize);
        List<User> userList = userMappertest.queryUserList(map);
        PageInfo pageInfo = new PageInfo(userList);

        long total = pageInfo.getTotal();
        Map<String,Object> resultMap=new HashMap<>();
        resultMap.put("total",total);
        resultMap.put("rows",userList);

     return resultMap;
    }

    /**
     * 根据条件查询用户
     * @param map
     * @return
     */
    @Override
    public int queryUser(Map<String, Object> map) {
        return userMappertest.queryUser(map);
    }

    /**
     * 添加用户信息
     * @param map
     */
    @Override
    public void addUser(Map<String, Object> map) {
        userMappertest.addUser(map);

    }

    /**
     * 功能描述：根据用户名更改用户信息
     * @param map
     */
    @Override
    public void updateUser(Map<String, Object> map) {
        userMappertest.updateUser(map);
    }

    /**
     * 功能描述：根据用户id更改用户信息
     * @param map
     */
    @Override
    public void updateUserById(Map<String, Object> map) {
        userMappertest.updateUserById(map);
    }


    /**
     * 功能描述：删除用户
     * @param map
     */
    @Override
    public void delUser(Map<String, Object> map) {
        userMappertest.delUser(map);
    }


    /**
     * 功能描述：修改用户密码
     * @param map
     */
    @Override
    public void updateUserPass(Map<String, Object> map) {
        userMappertest.updateUserPass(map);
    }
}
