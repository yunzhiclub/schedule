package com.yunzhi.schedule.service;


import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService{
    private final ScheduleRepository scheduleRepository;
    public ScheduleServiceImpl(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public List<Schedule> getAllByCourseIdAndTermId(Long courseId, Long termId) {
        return this.scheduleRepository.findSchedulesByCourseIdAndTermId(courseId, termId);
    }
}
