package club.yunzhi.schedule.entity;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.SQLDelete;

import javax.persistence.*;

/**
 * 班级实体
 */
@Entity
@SQLDelete(sql = "update `clazz` set deleted = 1 where id = ?")
public class Clazz implements SoftDelete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("id")
    @JsonView(IdJsonView.class)
    private Long id;


    @ApiModelProperty("班级名称")
    @JsonView(NameJsonView.class)
    private String name;

    @ApiModelProperty("入学时间")
    @JsonView(EntranceDateJsonView.class)
    private Long entranceDate;
    @ApiModelProperty("学生人数")
    @JsonView(StudentNumberJsonView.class)
    private Long studentNumber;

    @ApiModelProperty("是否已删除")
    private Boolean deleted = false;

//    @OneToMany(mappedBy = "clazz")
//    @JsonView(StudentsJsonView.class)
//    private List<Student> students = new ArrayList<>();


//    public List<Student> getStudents() {
//        return students;
//    }
//
//    public void setStudents(List<Student> students) {
//        this.students = students;
//    }
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

    public Long getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(Long studentNumber) {
        this.studentNumber = studentNumber;
    }

    public interface IdJsonView {}
    public interface NameJsonView {}
    public interface EntranceDateJsonView {}
    public interface StudentsJsonView {}
    public interface StudentNumberJsonView {}
}
