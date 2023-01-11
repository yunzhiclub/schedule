package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.User;
import com.yunzhi.schedule.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;


@RestController
@RequestMapping("user")
public class UserController {

    UserService userService;
    HttpServletRequest request;

    @Autowired
    UserController(UserService userService,
                   HttpServletRequest request) {
        this.userService = userService;
        this.request = request;
    }

    @GetMapping("{id}")
    public User getById(@PathVariable Long id) {
        return this.userService.findById(id);
    }

    @GetMapping("me")
    public User getCurrentLoginUser() {
        return this.userService.getCurrentLoginUser();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User save(@RequestBody User student) {
        return userService.save(student);
    }

    @RequestMapping("login")
    public User login() {
        return this.userService.login();
    }
}
