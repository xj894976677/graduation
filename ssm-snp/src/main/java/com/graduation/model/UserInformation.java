package com.graduation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInformation {
    private String userId;
    private String userName;
    private String mail;
    private String telephone;
    private String sex;
    private Date birthday;
    private String synopsis;
}
