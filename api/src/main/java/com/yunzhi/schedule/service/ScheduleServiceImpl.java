package com.yunzhi.schedule.service;


import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.ScheduleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        return this.scheduleRepository.findSchedulesByCourseIdAndTermIdAndDeletedFalse(courseId, termId);
    }

    @Override
    public List<Schedule> getSchedulesInCurrentTerm(Term term) {
        return this.scheduleRepository.findSchedulesByTermAndDeletedFalse(term);
    }

    @Override
    public Page<Schedule> page(String courseName, String termName, String clazzName, String teacherName, Pageable pageable) {
        return this.scheduleRepository.findAll(courseName, termName, clazzName, teacherName, pageable);
    }

    @Override
    public Schedule add(Schedule schedule) {
        return this.scheduleRepository.save(schedule);
    }
}
