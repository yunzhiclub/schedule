package com.yunzhi.schedule.entity;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

/**
 * 班级实体
 */
@Entity
@SQLDelete(sql = "update `clazz` set deleted = 1 where id = ?")
public class Clazz implements SoftDelete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    private Long id;


    @ApiModelProperty("班级名称")
    private String name;

    @ApiModelProperty("入学时间")
    private Long entranceDate;


    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;
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

    public Long getEntranceDate() {
        return entranceDate;
    }

    public void setEntranceDate(Long entranceDate) {
        this.entranceDate = entranceDate;
    }
    @Override
    public Boolean getDeleted() {
        return this.deleted;
    }

    private void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
