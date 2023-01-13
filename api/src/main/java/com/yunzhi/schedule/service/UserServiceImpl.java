package com.yunzhi.schedule.service;

import com.yunzhi.schedule.config.Encoder;
import com.yunzhi.schedule.entity.User;
import com.yunzhi.schedule.filter.TokenFilter;
import com.yunzhi.schedule.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {
    /** auth-token与teacherId的映射 */
    private HashMap<String, Long> xAuthTokenUserIdHashMap = new HashMap<>();

    private final HttpServletRequest request;

    UserRepository userRepository;

    @Autowired
    UserServiceImpl(UserRepository userRepository, HttpServletRequest request) {
        this.userRepository = userRepository;
        this.request = request;
    }
    @Override
    public User findById(Long id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("未找到相关实体"));
    }

    @Override
    public User save(User student) {
        return null;
    }

    @Override
    public User login() {
        // 获取 basic Authorization
        String authorization = request.getHeader("Authorization");
        List<String> data = this.getData(authorization);
        String phone = data.get(0);
        String password = data.get(1);
        // 通过phone 找到user验证密码
        User user = this.userRepository.findByPhoneAndDeletedFalse(phone);
        Boolean status = this.validataPassword(user, password);
        if (status) {
            // 用户和xAuthToken绑定
            this.setAuthHashMap(user.getId());
            return user;
        } else {
            return null;
        }
    }

    private void setAuthHashMap(Long id) {
        this.xAuthTokenUserIdHashMap.put(request.getHeader(TokenFilter.TOKEN_KEY), id);
    }

    private Boolean validataPassword(User user, String password) {
        if (user != null && Encoder.getMD5Result(password).equals(user.getPassword())) {
            System.out.println("密码正确");
            return true;
        }
        return false;
    }

    private List<String> getData(String authorization) {
        List<String> data = new ArrayList<>();
        String message = (String) Arrays.stream(authorization.split(" ")).toArray()[1];
        Object[] objects = Arrays.stream(this.base64Decode(message).split(":")).toArray();
        data.add(objects[0].toString());
        data.add(objects[1].toString());
        return data;
    }


    public static String base64Decode(String str) {
        Base64.Decoder decoder = Base64.getDecoder();
        byte[] b = decoder.decode(str);
        String s = null;
        try {
            s = new String(b, "UTF8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        return s;
    }

    @Override
    public boolean isLogin(String XAuthToken) {
        // 获取xAuthToken映射的userId
        Long userId = this.xAuthTokenUserIdHashMap.get(XAuthToken);
        return userId != null;
    }

    @Override
    public User getCurrentLoginUser() {
        String xAuthToken = request.getHeader(TokenFilter.TOKEN_KEY);
        Long userId = this.xAuthTokenUserIdHashMap.get(xAuthToken);
        try {
            return this.findById(userId);
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    @Override
    public User update(Long userId, User user) {
        Assert.notNull(user.getName(), "name不能为null");
        Assert.notNull(user.getPhone(), "phone不能为null");
        User OldUser = this.getById(userId);
        OldUser.setName(user.getName());
        OldUser.setPhone(user.getPhone());
        return this.userRepository.save(OldUser);
    }

    @Override
    public User getById(Long id) {
        return this.userRepository.findById(id).get();
    }
}
