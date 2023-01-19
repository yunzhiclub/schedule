package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.entity.forType.ForUpdateClazzesAndTeachers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ScheduleService {
    List<Schedule> getAllByCourseIdAndTermId(Long courseId, Long id);

    /**
     * 获取某个学期中的所有排课
     */
    List<Schedule> getSchedulesInCurrentTerm(Term term);

    Page<Schedule> page(String courseName, String termName, String clazzName, String teacherName, Pageable pageable);

    Schedule add(Schedule schedule);

    Schedule getById(Long id);

    void deleteById(Long scheduleId);

    void removeClazzFromSchedule(Long aLong, Long aLong1);

    void updateClazzesAndTeachers(ForUpdateClazzesAndTeachers forUpdateClazzesAndTeachers);
}
