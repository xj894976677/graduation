package com.graduation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSay {
    private Integer textId;
    private String userId;
    private String text;
    private String picUrl;
    private Timestamp moment;
    private String address;
    private Integer thumb;
    private Integer discuss;
    private String userName;
    private String userUrl;
    private String sayType;
    private String isThumb;
}
