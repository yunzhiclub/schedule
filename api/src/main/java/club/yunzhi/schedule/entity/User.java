package club.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;

@Entity
@SQLDelete(sql = "update `user` set deleted = 1 where id = ?")
public class User implements SoftDelete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    @JsonView(IdJsonView.class)
    private Long id;

    /**
     * 密码加密
     */
    private static PasswordEncoder passwordEncoder;

    @ApiModelProperty("名称")
    @JsonView(NameJsonView.class)
    private String name;

    @ApiModelProperty("手机号")
    @JsonView(PhoneJsonView.class)
    private String phone;

    @ApiModelProperty("密码")
    @JsonView(PasswordJsonView.class)
    private String password;

    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;

    @OneToOne(mappedBy = "user")
    @JsonView(WeChatUserJsonView.class)
    private WeChatUser weChatUser = null;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        if (User.passwordEncoder == null) {
            throw new RuntimeException("未设置User实体的passwordEncoder，请调用set方法设置");
        }
        this.password = User.passwordEncoder.encode(password);
    }
    public static void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        User.passwordEncoder = passwordEncoder;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
    @Override
    public Boolean getDeleted() {
        return this.deleted;
    }

    private void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public WeChatUser getWeChatUser() {
        return weChatUser;
    }

    public void setWeChatUser(WeChatUser weChatUser) {
        this.weChatUser = weChatUser;
    }

    public interface IdJsonView {}
    public interface NameJsonView {}
    public interface PhoneJsonView {}
    public interface PasswordJsonView {}

    public interface WeChatUserJsonView {}

}
