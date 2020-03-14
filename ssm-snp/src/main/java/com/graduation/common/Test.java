package com.graduation.common;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.test.context.TestExecutionListeners;

import java.util.Calendar;
import java.util.Date;

public class Test {
    public static void main(String[] args){
        long time = DateUtil.getTimeStamp("2020-03-03","yyyy-MM-dd");
        java.sql.Date date = DateUtil.getSqlStamp("2020-03-03","yyyy-MM-dd");
        System.out.println(time);
        System.out.println(date);
    }
}
