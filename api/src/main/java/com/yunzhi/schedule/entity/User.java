package com.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@SQLDelete(sql = "update `user` set deleted = 1 where id = ?")
public class User implements SoftDelete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    @JsonView(IdJsonView.class)
    private Long id;

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
        this.password = password;
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

    public interface IdJsonView {}
    public interface NameJsonView {}
    public interface PhoneJsonView {}
    public interface PasswordJsonView {}

}
