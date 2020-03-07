package com.graduation.service_impl;

import com.graduation.mapper_api.BookMapper;
import com.graduation.model.Book;
import com.graduation.model.BookSub;
import com.graduation.service_api.IBookService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/14
 * @Description:cn.xueden.service.impl
 * @version:1.0
 */
@Service
public class BookServiceImpl implements IBookService {

    @Autowired
    private BookMapper bookMapper;

    /**
     * 功能描述：查看图书列表
     * @param map
     * @return
     */
    @Override
    public Map<String, Object> queryBookList(Map<String, Object> map) {

        //当前页
        int pageNum = Integer.parseInt(map.get("pageNum").toString());
        //每页几条记录
        int pageSize = Integer.parseInt(map.get("pageSize").toString());

        PageHelper.startPage(pageNum,pageSize);
        List<Book> bookList = bookMapper.queryBookList(map);
        PageInfo pageInfo = new PageInfo(bookList);
        long total = pageInfo.getTotal();

        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("total",total);
        resultMap.put("rows",bookList);

        return resultMap;
    }

    /**
     * 功能描述：添加图书
     * @param map
     */
    @Override
    public void addBook(Map<String, Object> map) {
        bookMapper.addBook(map);
    }


    /**
     * 功能描述：编辑图书
     * @param map
     */
    @Override
    public void editBook(Map<String, Object> map) {
        bookMapper.editBook(map);
    }


    /**
     * 功能描述：删除图书
     * @param map
     */
    @Override
    public void delBook(Map<String, Object> map) {
        bookMapper.delBook(map);
    }


    /**
     * 功能描述：借阅图书
     * @param map
     */
    @Override
    public void addSubBook(Map<String, Object> map) {
        bookMapper.addSubBook(map);
    }


    /**
     * 功能描述：归还图书
     * @param map
     */
    @Override
    public void returnSubBook(Map<String, Object> map) {
        bookMapper.returnSubBook(map);
    }

    /**
     * 功能描述：查看借阅图书列表
     * @param map
     * @return
     */
    @Override
    public Map<String, Object> querySub(Map<String, Object> map) {

        List<BookSub> bookSubList = bookMapper.querySub(map);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("rows",bookSubList);

        return resultMap;
    }


    /**
     * 功能描述：更新图书库存
     * @param map
     */
    @Override
    public void updateInventtories(Map<String, Object> map) {
        bookMapper.updateInventtories(map);
    }
}
