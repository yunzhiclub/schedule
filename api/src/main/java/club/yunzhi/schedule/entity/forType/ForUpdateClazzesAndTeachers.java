package club.yunzhi.schedule.entity.forType;

import java.util.ArrayList;
import java.util.List;

public class ForUpdateClazzesAndTeachers {
    private Long scheduleId;
    private Long teacher1Id;
    private Long teacher2Id;
    private List<Long> clazzIds = new ArrayList<>();

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }
    public Long getTeacher1Id() {
        return teacher1Id;
    }

    public void setTeacher1Id(Long teacher1Id) {
        this.teacher1Id = teacher1Id;
    }
    public Long getTeacher2Id() {
        return teacher2Id;
    }

    public void setTeacher2Id(Long teacher2Id) {
        this.teacher2Id = teacher2Id;
    }
    public List<Long> getClazzIds() {
        return clazzIds;
    }

    public void setClazzIds(List<Long> clazzIds) {
        this.clazzIds = clazzIds;
    }
}
