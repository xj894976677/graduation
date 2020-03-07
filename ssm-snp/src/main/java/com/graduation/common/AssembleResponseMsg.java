package com.graduation.common;

import com.graduation.model.InfoMsg;
import com.graduation.model.ResponseBody;


/**
 * 功能描述：封装ResponseBody内容
 * @Auther:http://www.xueden.cn
 * @Date:2019/12/12
 * @Description:cn.xueden.common
 * @version:1.0
 */
public class AssembleResponseMsg {

    /**
     * 成功返回内容
     * @Author AZhen
     * @Param [data]
     * @return ResponseBody
     **/
    public <T> ResponseBody success(T data){
        ResponseBody<T> resp=new ResponseBody<T>();
        resp.setData(data);
        InfoMsg info=new InfoMsg();
        resp.setInfo(info);
        return resp;
    }

    /**
     * 失败/异常返回内容
     * @Author AZhen
     * @Param [status, errorCode, message]
     * @return ResponseBody
     **/
    public <T>ResponseBody failure(int status,String errorCode,String message){
        ResponseBody<T> resp=new ResponseBody<T>();
        resp.setStatus(status);
        InfoMsg info=new InfoMsg();
        info.setCode(errorCode);
        info.setMessage(message);
        resp.setInfo(info);
        return resp;
    }
}
