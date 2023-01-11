package com.yunzhi.schedule.interceptor;

import com.yunzhi.schedule.filter.TokenFilter;
import com.yunzhi.schedule.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 认证拦截器
 * @author panjie
 */
//'org.springframework.web.servlet.handler.HandlerInterceptorAdapter' is deprecated
@Component
public class AuthInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(AuthInterceptor.class);
    UserService userService;
    AuthInterceptor(UserService userService) {
        this.userService = userService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // 获取请求地址及请求方法
        String url = request.getRequestURI();
        String method = request.getMethod();
        //  && "GET".equals(method)
        // 判断请求地址、方法是否与用户登录相同
        if ("/user/login".equals(url) && "GET".equals(method)) {
            return true;
        }
        // auth-token是否绑定了用户
        String authToken = request.getHeader(TokenFilter.TOKEN_KEY);
        if (this.userService.isLogin(authToken)) {
            System.out.println("用户已登录");
            return true;
        }

        // 为响应加入提示：用户未登录
        response.setStatus(401);
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           @Nullable ModelAndView modelAndView) throws Exception {
        logger.info("执行拦截器postHandle");
    }
}
