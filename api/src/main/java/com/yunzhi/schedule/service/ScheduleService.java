package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Term;

import java.util.List;

public interface ScheduleService {
    List<Schedule> getAllByCourseIdAndTermId(Long courseId, Long id);

    /**
     * 获取某个学期中的所有排课
     */
    List<Schedule> getSchedulesInCurrentTerm(Term term);
}
