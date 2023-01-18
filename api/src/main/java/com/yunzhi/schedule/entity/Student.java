package com.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;

/**
 * 学期实体
 */
@Entity
@SQLDelete(sql = "update `student` set deleted = 1 where id = ?")
public class Student implements SoftDelete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    @JsonView(IdJsonView.class)
    private Long id;

    @ApiModelProperty("姓名")
    @JsonView(NameJsonView.class)
    private String name;

    @ApiModelProperty("性别")
    @JsonView(SexJsonView.class)
    private boolean sex;

    @ApiModelProperty("学号")
    @JsonView(SnoJsonView.class)
    private String sno;

    @ManyToOne
    @JoinColumn(name = "clazz_id")
    @JsonView(ClazzJsonView.class)
    @ApiModelProperty("班级")
    private Clazz clazz;


    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;

    public String getSno() {
        return sno;
    }

    public void setSno(String sno) {
        this.sno = sno;
    }

    public Clazz getClazz() {
        return clazz;
    }

    public void setClazz(Clazz clazz) {
        this.clazz = clazz;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean getSex() {
        return sex;
    }

    public void setSex(boolean sex) {
        this.sex = sex;
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
    public interface SexJsonView {}
    public interface SnoJsonView {}
    public interface ClazzJsonView {}
}
