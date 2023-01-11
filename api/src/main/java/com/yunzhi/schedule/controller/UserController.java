package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.User;
import com.yunzhi.schedule.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Array;
import java.util.Base64;
import java.util.List;


@RestController
@RequestMapping("user")
public class UserController {

    UserService userService;

    @Autowired
    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("{id}")
    public User getById(@PathVariable Long id) {
        return this.userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User save(@RequestBody User student) {
        return userService.save(student);
    }

    @RequestMapping("login")
    public User login(@RequestParam String basicMessage) {
        byte[] message = Base64.getDecoder().decode(basicMessage);
        for (int i = 0; i < message.length; i++) {
            System.out.println(message[i]);
        }
        return this.userService.login(basicMessage);
    }
}
