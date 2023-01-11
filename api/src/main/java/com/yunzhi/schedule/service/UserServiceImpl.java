package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.User;
import com.yunzhi.schedule.filter.TokenFilter;
import com.yunzhi.schedule.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.HashMap;

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
        return null;
    }

    @Override
    public User save(User student) {
        return null;
    }

    @Override
    public User login(String phone) {
        return null;
    }

    @Override
    public boolean isLogin(String XAuthToken) {
        // 获取xAuthToken映射的userId
        Long userId = this.xAuthTokenUserIdHashMap.get(XAuthToken);
        return userId != null;
    }
}
