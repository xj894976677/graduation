package com.graduation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSayNum {
    private String userId;
    private Integer total;
    private Integer funny;
    private Integer anime;
    private Integer news;
    private Integer fashion;
    private Integer motion;
    private Integer science;
}
