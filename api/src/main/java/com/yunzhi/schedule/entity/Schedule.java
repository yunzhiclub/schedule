package com.yunzhi.schedule.entity;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@SQLDelete(sql = "update `room` set deleted = 1 where id = ?")
public class Schedule implements SoftDelete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("排课Id")
    private Long id;

    @ManyToOne
    @ApiModelProperty("该排课对应教师1")
    private Teacher teacher1 = new Teacher();

    @ManyToOne
    @ApiModelProperty("该排课对应教师2")
    private Teacher teacher2 = new Teacher();

    @ManyToOne
    @ApiModelProperty("该排课对应学期")
    private Term term = new Term();

    @ManyToOne
    @ApiModelProperty("该排课对应课程")
    private Course course = new Course();

    @ManyToMany
    @ApiModelProperty("该排课对应班级")
    private List<Clazz> clazzes = new ArrayList<>();

    @OneToMany(mappedBy = "schedule")
    @ApiModelProperty("排课所含调度")
    private List<Dispatch> dispatches = new ArrayList<>();

    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Teacher getTeacher1() {
        return teacher1;
    }

    public void setTeacher1(Teacher teacher) {
        this.teacher1 = teacher;
    }

    public Teacher getTeacher2() {
        return teacher2;
    }

    public void setTeacher2(Teacher teacher) {
        this.teacher2 = teacher;
    }

    public Term getTerm() {
        return term;
    }

    public void setTerm(Term term) {
        this.term = term;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public List<Clazz> getClazzes() {
        return clazzes;
    }

    public void setClazzes(List<Clazz> clazzes) {
        this.clazzes = clazzes;
    }

    public List<Dispatch> getDispatches() {
        return dispatches;
    }

    public void setDispatches(List<Dispatch> dispatches) {
        this.dispatches = dispatches;
    }

    @Override
    public Boolean getDeleted() {
        return this.deleted;
    }

    private void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
