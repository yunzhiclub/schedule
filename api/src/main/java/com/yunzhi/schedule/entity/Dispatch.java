package com.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@SQLDelete(sql = "update `room` set deleted = 1 where id = ?")
public class Dispatch implements SoftDelete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("调度ID")
    private Long id;

    @ManyToOne
    @ApiModelProperty("对应排课")
    @JsonIgnoreProperties({"dispatches"})
    private Schedule schedule = new Schedule();

    @ApiModelProperty("对应周")
    private Long week;
    @ApiModelProperty("对应天")
    private Long day;
    @ApiModelProperty("对应节")
    private Long lesson;
    @ManyToMany
    @ApiModelProperty("对应教室")
    private List<Room> rooms = new ArrayList<>();

    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public Long getWeek() {
        return week;
    }

    public void setWeek(Long week) {
        this.week = week;
    }

    public Long getDay() {
        return day;
    }

    public void setDay(Long day) {
        this.day = day;
    }

    public Long getLesson() {
        return lesson;
    }

    public void setLesson(Long lesson) {
        this.lesson = lesson;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }

    @Override
    public Boolean getDeleted() {
        return this.deleted;
    }

    private void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
