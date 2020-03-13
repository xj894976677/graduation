package com.graduation.common;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.test.context.TestExecutionListeners;

import java.util.Calendar;
import java.util.Date;

public class Test {
    public static void main(String[] args){
        String time = DateUtil.getStrTimeStamp(+3);
        System.out.println(time);
        System.out.println(DateUtil.compareWithCurrent(time));
    }
}
