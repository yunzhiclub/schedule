package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.User;

import java.security.Principal;

public interface UserService {

    User findById(Long id);

    User save(User student);

    User login();

    /**
     * 判断用户是否登录
     * @param XAuthToken 认证令牌
     * @return
     */
    boolean isLogin(String XAuthToken);

    /**
     * 获取当前登录用户
     * @return user
     */
    User getCurrentLoginUser();

    User update(Long userId, User user);

    User getById(Long id);
}
