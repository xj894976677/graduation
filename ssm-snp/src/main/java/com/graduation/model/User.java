package com.graduation.model;

import java.io.Serializable;

/**
 * 功能描述：用户实体类
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/12
 * @Description:cn.xueden.model
 * @version:1.0
 */
public class User implements Serializable {
    private int id;
    private String uid;    //uid
    private String userName;   //用户名
    private String password;    //密码
    private String uName;      //姓名
    private Integer age;    //年龄
    private Integer sex;    //性别

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getuName() {
        return uName;
    }

    public void setuName(String uName) {
        this.uName = uName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", uid='" + uid + '\'' +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", uName='" + uName + '\'' +
                ", age=" + age +
                ", sex=" + sex +
                '}';
    }
}
