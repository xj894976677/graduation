package com.graduation.service_impl;

import com.graduation.mapper_api.MailMapper;
import com.graduation.model.MailCode;
import com.graduation.service_api.IMailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
@Service
public class MailServiceImpl implements IMailService {
    @Autowired
    private MailMapper mailMapper;

    @Override
    public Integer mailExistence(Map<String, Object> map) {
        return mailMapper.mailExistence(map);
    }

    @Override
    public void addNewMail(Map<String, Object> map) {
        mailMapper.addNewMail(map);
    }

    @Override
    public void updateCode(Map<String, Object> map) {
        mailMapper.updateCode(map);
    }

    @Override
    public MailCode selectMailCode(Map<String, Object> map) {
        return mailMapper.selectMailCode(map);
    }
}
