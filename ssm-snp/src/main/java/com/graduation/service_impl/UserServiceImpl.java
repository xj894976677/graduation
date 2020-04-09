package com.graduation.service_impl;

import com.graduation.common.DateUtil;
import com.graduation.mapper_api.UserMapper;
import com.graduation.model.UserInformation;
import com.graduation.service_api.IUserService;
import org.apache.ibatis.jdbc.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserMapper userMapper;
    @Override
//    登录
    public String login(Map<String, Object> map) {
        return userMapper.login(map);
    }

    @Override
//    通过账号查询是否存在用户
    public Integer queryUser(Map<String, Object> map) {
        return userMapper.queryUser(map);
    }

    @Override
//    添加用户
    public void addUser(Map<String, Object> map) {
        userMapper.addUser(map);
    }

    @Override
    public void addInformation(Map<String, Object> map) {
        userMapper.addInformation(map);
    }

    @Override
//    通过id查询用户信息
    public UserInformation userInformation(Map<String, Object> map) {
        UserInformation userInformation = userMapper.userInformation(map);
        if (userInformation == null){
            return null;
        }
        if (userInformation.getUserName() == null){
            userInformation.setUserName("");
        }
        if (userInformation.getSex() == null){
            userInformation.setSex("");
        }
        if (userInformation.getBirthday() == null){
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            java.util.Date d = null;
            try {
                d = format.parse("1990-01-01");
            } catch (Exception e) {
                e.printStackTrace();
            }
            java.sql.Date date = new java.sql.Date(d.getTime());
            userInformation.setBirthday(date);
        }
        if (userInformation.getSynopsis() == null){
            userInformation.setSynopsis("");
        }
        if (userInformation.getTelephone() == null){
            userInformation.setTelephone("");
        }
        if (userInformation.getMail() == null){
            userInformation.setMail("");
        }
        if (userInformation.getHeadUrl() == null){
            userInformation.setHeadUrl("http://a3q.dns06.net.cn/15859785123626.jpeg");
        }

        return userInformation;
    }

    @Override
    public void updateMail(Map<String, Object> map) {
        userMapper.updateMail(map);
    }

    @Override
    public Integer queryMail(Map<String, Object> map) {
        return userMapper.queryMail(map);
    }

    @Override
    public String userIdfromMail(Map<String, Object> map) {
        return userMapper.userIdfromMail(map);
    }

    @Override
    public String mailfromUserId(Map<String, Object> map) {
        return userMapper.mailfromUserId(map);
    }

    @Override
    public void updatePassword(Map<String, Object> map) {
        userMapper.updatePassword(map);
    }

    @Override
    public void updateInformation(Map<String,Object> map) {
//        UserInformation userInformation = new UserInformation();
//        userInformation.setUserName("项钧");
//        userInformation.setTelephone((String) map.get("telephone"));
//        userInformation.setSynopsis("项钧");
//        userInformation.setSex((String) map.get("sex"));
//        userInformation.setUserId((String) map.get("userId"));
//        java.sql.Date date = DateUtil.getSqlStamp((String) map.get("birthday"),"yyyy-MM-dd");
//        userInformation.setBirthday(date);
//        以上代码暂时保留，原因：数据库乱码问题尚未明确原因
        userMapper.updateInformation(map);
    }

    @Override
    public void bandmail(Map<String, Object> map) {
        userMapper.bandmail(map);
    }

    @Override
    public List<String> RecommendedFriend(Map<String, Object> map) {
        return userMapper.RecommendedFriend(map);
    }
}
