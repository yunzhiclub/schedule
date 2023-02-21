package club.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@SQLDelete(sql = "update `course` set deleted = 1 where id = ?")
public class Course implements SoftDelete {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    @JsonView(IdJsonView.class)
    private Long id;

    @ApiModelProperty("名称")
    @JsonView(NameJsonView.class)
    private String name;

    @ApiModelProperty("课时")
    @JsonView(HoursJsonView.class)
    private String hours;

    @ApiModelProperty("排课")
    @JsonView(SchedulesJsonView.class)
    @OneToMany(mappedBy = "course")
    @Where(clause = "deleted = false")
    private List<Schedule> schedules = new ArrayList<>();

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

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }
    @Override
    public Boolean getDeleted() {
        return this.deleted;
    }

    private void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public List<Schedule> getSchedules() {
        return schedules;
    }

    public void setSchedules(List<Schedule> schedules) {
        this.schedules = schedules;
    }

    public interface IdJsonView {}
    public interface NameJsonView {}
    public interface HoursJsonView {}
    public interface SchedulesJsonView {}

}
