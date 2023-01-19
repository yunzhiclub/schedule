package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.User;
import com.yunzhi.schedule.entity.vo.PasswordUser;
import com.yunzhi.schedule.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.ValidationException;


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
        if (id == null) {
            return null;
        }
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

    @RequestMapping("logout")
    public void logout() {
        System.out.println("---------------------");
        this.userService.logout();
    }

    /**
     * 更新用户
     * @param userId   用户id
     * @param user   更新后的用户数据
     * @return 教师
     */
    @PostMapping("update/{userId}")
    public User update(@PathVariable Long userId,
                          @RequestBody User user) {
        return this.userService.update(userId, user);
    }

    /**
     * 校验密码是否正确接口
     * @param user user
     * @return boolean
     */
    @PostMapping("checkPasswordIsRight")
    public boolean checkPasswordIsRight(@RequestBody User user) {
        return this.userService.checkPasswordIsRight(user.getPassword());
    }
    /**
     * 更新密码
     * @param user user  新密码
     * @return boolean
     */
    @PutMapping("updatePassword")
    public void updatePassword(@RequestBody PasswordUser user) throws ValidationException {
        this.userService.updatePassword(user.getPassword(), user.getNewPassword());
    }
}
