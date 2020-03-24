package com.graduation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Discuss {
    private String userId;
    private String textId;
    private String sayUserId;
    private String discuss;
    private Timestamp moment;
    private String isread;
    private String userName;
    private String picUrl;
}
