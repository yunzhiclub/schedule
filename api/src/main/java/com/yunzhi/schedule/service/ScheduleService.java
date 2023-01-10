package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Schedule;

import java.util.List;

public interface ScheduleService {
    List<Schedule> clazzesHaveSelectCourse(Long course_id);
}
