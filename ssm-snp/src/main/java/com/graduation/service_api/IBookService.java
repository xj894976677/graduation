package com.graduation.service_api;

import java.util.Map;

/**
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/14
 * @Description:cn.xueden.service
 * @version:1.0
 */
public interface IBookService {

    //查看图书列表
    Map<String,Object> queryBookList(Map<String,Object> map);

    //新增图书
    void addBook(Map<String,Object> map);

    //编辑图书
    void editBook(Map<String,Object> map);

    //删除图书
    void delBook(Map<String,Object> map);

    //借阅图书
    void addSubBook(Map<String,Object> map);

    //归还图书
    void returnSubBook(Map<String,Object> map);

    //查看借阅图书列表
    Map<String,Object> querySub(Map<String,Object> map);

    //更新图书库存
    void updateInventtories(Map<String,Object> map);
}
