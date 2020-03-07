package com.graduation.model;

/**
 * 功能描述：用户借书记录
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/15
 * @Description:cn.xueden.model
 * @version:1.0
 */
public class BookSub {

    private int id;

    private int uId;

    private int bId;

    private String subDateTime;

    private String returnDateTime;

    private int bookType;

    private int returntype;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getuId() {
        return uId;
    }

    public void setuId(int uId) {
        this.uId = uId;
    }

    public int getbId() {
        return bId;
    }

    public void setbId(int bId) {
        this.bId = bId;
    }

    public String getSubDateTime() {
        return subDateTime;
    }

    public void setSubDateTime(String subDateTime) {
        this.subDateTime = subDateTime;
    }

    public String getReturnDateTime() {
        return returnDateTime;
    }

    public void setReturnDateTime(String returnDateTime) {
        this.returnDateTime = returnDateTime;
    }

    public int getBookType() {
        return bookType;
    }

    public void setBookType(int bookType) {
        this.bookType = bookType;
    }

    public int getReturntype() {
        return returntype;
    }

    public void setReturntype(int returntype) {
        this.returntype = returntype;
    }

    @Override
    public String toString() {
        return "BookSub{" +
                "id=" + id +
                ", uId=" + uId +
                ", bId=" + bId +
                ", subDateTime='" + subDateTime + '\'' +
                ", returnDateTime='" + returnDateTime + '\'' +
                ", bookType=" + bookType +
                ", returntype=" + returntype +
                '}';
    }
}
