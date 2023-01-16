package com.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

/**
 * 学期实体
 */
@Entity
@SQLDelete(sql = "update `term` set deleted = 1 where id = ?")
public class Term implements SoftDelete {

    public static Boolean ACTIVATE = true;
    public static Boolean NOT_ACTIVATE = false;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    private Long id;

    @ApiModelProperty("学期状态")
    private Boolean state = false;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @ApiModelProperty("学期名称")
    @JsonView(NameJsonView.class)
    private String name = "";

    @ApiModelProperty("开学时间")
    @JsonView(StartTimeJsonView.class)
    private Long startTime;

    @ApiModelProperty("结束时间")
    @JsonView(EndTimeJsonView.class)
    private Long endTime;

    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    @Override
    public Boolean getDeleted() {
        return this.deleted;
    }

    private void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public interface NameJsonView {}
    public interface StartTimeJsonView {}
    public interface EndTimeJsonView {}
}
