package club.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 教师实体
 */
@Entity
@SQLDelete(sql = "update `teacher` set deleted = 1 where id = ?")
public class Teacher implements SoftDelete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    @JsonView(IdJsonView.class)
    private Long id;

    @ApiModelProperty("名称")
    @JsonView(NameJsonView.class)
    private String name;

    @ApiModelProperty("手机号")
    @Column(unique = true)
    @JsonView(PhoneJsonView.class)
    private String phone;

    @ApiModelProperty("性别")
    @JsonView(SexJsonView.class)
    private Boolean sex;


    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;

    @OneToMany(mappedBy = "teacher1")
    @ApiModelProperty("该教师作为教师1的对应排课")
    @JsonView(Schedules1JsonView.class)
    @Where(clause = "deleted = false")
    private List<Schedule> schedules1 = new ArrayList<>();

    @OneToMany(mappedBy = "teacher2")
    @ApiModelProperty("该教师作为教师1的对应排课")
    @JsonView(Schedules2JsonView.class)
    @Where(clause = "deleted = false")
    private List<Schedule> schedules2 = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getSex() {
        return sex;
    }

    public void setSex(Boolean sex) {
        this.sex = sex;
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
    public List<Schedule> getSchedules1() {
        return schedules1;
    }

    public void setSchedules1(List<Schedule> schedules1) {
        this.schedules1 = schedules1;
    }

    public List<Schedule> getSchedules2() {
        return schedules2;
    }

    public void setSchedules2(List<Schedule> schedules2) {
        this.schedules2 = schedules2;
    }


    public interface IdJsonView {}
    public interface NameJsonView {}
    public interface SexJsonView {}
    public interface PhoneJsonView {}
    public interface Schedules1JsonView {}
    public interface Schedules2JsonView {}
}
