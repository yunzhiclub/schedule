package club.yunzhi.schedule.service;

import club.yunzhi.schedule.entity.Schedule;
import club.yunzhi.schedule.entity.Term;
import club.yunzhi.schedule.entity.forType.ForUpdateClazzesAndTeachers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ScheduleService {
    List<Schedule> getAllByCourseIdAndTermId(Long courseId, Long id);

    /**
     * 获取某个学期中的所有排课
     */
    List<Schedule> getSchedulesByTerm(Term term);

    Page<Schedule> page(String courseName, Long termId, String clazzName, String teacherName, Pageable pageable);

    Schedule add(Schedule schedule);

    Schedule getById(Long id);

    void deleteById(Long scheduleId);

    void removeClazzFromSchedule(Long aLong, Long aLong1);

    void updateClazzesAndTeachers(ForUpdateClazzesAndTeachers forUpdateClazzesAndTeachers);
}
