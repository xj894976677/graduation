package com.graduation.controller;

import com.graduation.common.AssembleResponseMsg;
import com.graduation.model.ResponseBody;
import com.graduation.service_api.IBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 功能描述：图书控制层
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/14
 * @Description:cn.xueden.controller
 * @version:1.0
 */
@RestController
public class BookController {

    @Autowired
    private IBookService bookService;

    /**
     * 功能描述：查看图书列表
     * @param map
     * @return
     */
    @RequestMapping(value = "/queryBookList",produces = "application/json;charset=utf-8")
    public ResponseBody queryBookList(@RequestBody Map<String,Object> map){
        Map<String,Object> resultMap = bookService.queryBookList(map);
        return new AssembleResponseMsg().success(resultMap);
    }


    /**
     * 功能描述：新增图书
     * @param map
     * @return
     */
    @RequestMapping(value = "/addBook",produces = "application/json;charset=utf-8")
    public ResponseBody addBook(@RequestBody Map<String,Object> map){
        try {
            bookService.addBook(map);
            return new AssembleResponseMsg().success("OK");
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","添加失败");
        }
    }

    /**
     * 功能描述：编辑图书
     * @param map
     * @return
     */
    @RequestMapping(value = "/editBook",produces = "application/json;charset=utf-8")
    public ResponseBody editBook(@RequestBody Map<String,Object> map){
        try {
            bookService.editBook(map);
            return new AssembleResponseMsg().success("OK");
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","编辑失败");
        }
    }

    /**
     * 功能描述：删除图书
     * @param map
     * @return
     */
    @RequestMapping(value = "/delBook",produces = "application/json;charset=utf-8")
    public ResponseBody delBook(@RequestBody Map<String,Object> map){
        try {
            bookService.delBook(map);
            return new AssembleResponseMsg().success("OK");
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","删除失败");
        }
    }

    /**
     * 功能描述：借阅图书
     * @param map
     * @return
     */
    @RequestMapping(value = "/addSubBook",produces = "application/json;charset=utf-8")
    public ResponseBody addSubBook(@RequestBody Map<String,Object> map){
        try {
            bookService.addSubBook(map);
            return new AssembleResponseMsg().success("OK");
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","删除失败");
        }
    }

    /**
     * 功能描述：归还图书
     * @param map
     * @return
     */
    @RequestMapping(value = "/returnSubBook",produces = "application/json;charset=utf-8")
    public ResponseBody returnSubBook(@RequestBody Map<String,Object> map){
        try {
            bookService.returnSubBook(map);
            return new AssembleResponseMsg().success("OK");
        }catch (Exception e){
            return new AssembleResponseMsg().failure(200,"error","删除失败");
        }
    }

    /**
     * 功能描述：查看借阅图书列表
     * @param map
     * @return
     */
    @RequestMapping(value = "/querySub",produces = "application/json;charset=utf-8")
    public ResponseBody querySub(@RequestBody Map<String,Object> map){
        Map<String,Object> resultMap = bookService.querySub(map);
        return new AssembleResponseMsg().success(resultMap);
    }

    /**
     * 功能描述：更新图书库存
     * @param map
     * @return
     */
    @RequestMapping(value = "/updateInventtories",produces = "application/json;charset=utf-8")
    public ResponseBody updateInventtories(@RequestBody Map<String,Object> map){
         bookService.updateInventtories(map);
        return new AssembleResponseMsg().success("OK");
    }

}
