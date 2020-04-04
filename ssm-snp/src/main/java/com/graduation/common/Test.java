package com.graduation.common;

public class Test {
    public static void main(String[] args){
//        long time = DateUtil.getTimeStamp("2020-03-03","yyyy-MM-dd");
//        java.sql.Date date = DateUtil.getSqlStamp("2020-03-03","yyyy-MM-dd");
//        System.out.println(time);
//        System.out.println(date);
        TLSSigAPIv2 tlsSigAPIv2 = new TLSSigAPIv2(1400345238, "2cc7413aad854106f41f3ef342797601181f562d3ffbd7a9553cde178f3281e8");
        System.out.println(tlsSigAPIv2.genSig("3", 604800));
    }
}
