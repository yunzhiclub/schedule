package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.User;

import javax.servlet.http.HttpSession;
import javax.xml.bind.ValidationException;
import java.util.Optional;

public interface UserService {

    User findById(Long id);

    User save(User student);

    /**
     * 判断用户是否登录
     * @param XAuthToken 认证令牌
     * @return
     */
    boolean isLogin(String XAuthToken);

    /**
     * 获取登录用户
     *
     * @return 登录用户 | null
     */
    Optional<User> getCurrentLoginUser();

    User update(Long userId, User user);

    User getById(Long id);

    User getByUsername(String name);


    boolean checkPasswordIsRight(String password);

    void updatePassword(String password, String newPassword) throws ValidationException;

    /**
     * 获取获取的二维码
     * @param wsLoginToken 用于登录的wsLoginToken
     * @param httpSession httpSession
     * @return 二维码图片地址
     */
    String getLoginQrCode(String wsLoginToken, HttpSession httpSession);

    /**
     * 生成绑定当前用户的微信二维码
     *
     * @param sessionId sessionId
     * @return 返回图片URL地址
     */
    String generateBindQrCode(String sessionId);


    boolean checkWeChatLoginUuidIsValid(String uuid);
}
