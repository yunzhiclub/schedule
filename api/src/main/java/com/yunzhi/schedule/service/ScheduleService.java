package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Schedule;

import java.util.List;

public interface ScheduleService {
    List<Schedule> getAllByCourseIdAndTermId(Long courseId, Long id);
}
