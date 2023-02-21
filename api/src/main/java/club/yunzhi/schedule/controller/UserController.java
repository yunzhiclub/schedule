package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.service.UserService;
import com.fasterxml.jackson.annotation.JsonView;
import club.yunzhi.schedule.entity.User;
import club.yunzhi.schedule.entity.vo.PasswordUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.bind.ValidationException;
import java.security.Principal;


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
    @JsonView(GetByIdJsonView.class)
    public User getById(@PathVariable Long id) {
        if (id == null) {
            return null;
        }
        return this.userService.findById(id);
    }

    @GetMapping("me")
    @JsonView(GetByIdJsonView.class)
    public User getCurrentLoginUser(Principal principal) {
        return principal == null ? null : this.userService.getCurrentLoginUser().get();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @JsonView(GetByIdJsonView.class)
    public User save(@RequestBody User student) {
        return userService.save(student);
    }

    @RequestMapping("login")
    @JsonView(GetByIdJsonView.class)
    public User login(Principal user) {
        return this.userService.getByUsername(user.getName());
    }


    @GetMapping("logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // 获取用户认证信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 存在认证信息，注销
        if (authentication != null) {
            new SecurityContextLogoutHandler().logout(request, response, authentication);
        }
    }

    /**
     * 更新用户
     * @param userId   用户id
     * @param user   更新后的用户数据
     * @return 教师
     */
    @PostMapping("update/{userId}")
    @JsonView(GetByIdJsonView.class)
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
    public boolean checkPasswordIsRight(@RequestBody PasswordUser user) {
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

    /**
     * 生成绑定微信的二维码
     * @param httpSession session
     * @return 二维码对应的系统ID(用于触发扫码后的回调)
     */
    @GetMapping("generateBindQrCode")
    public String generateBindQrCode(HttpSession httpSession) {
        return this.userService.generateBindQrCode(httpSession.getId());
    }

    /**
     * 获取登录的二维码
     * @param wsAuthToken webSocket认证token
     * @param httpSession session
     * @return 二维码对应的系统ID(用于触发扫码后的回调)
     */
    @GetMapping("getLoginQrCode/{wsAuthToken}")
    public String getLoginQrCode(@PathVariable String wsAuthToken, HttpSession httpSession) {
        return this.userService.getLoginQrCode(wsAuthToken, httpSession);
    }

    public interface GetByIdJsonView extends
            User.IdJsonView,
            User.NameJsonView,
            User.PhoneJsonView,
            User.WeChatUserJsonView
    {}


}
