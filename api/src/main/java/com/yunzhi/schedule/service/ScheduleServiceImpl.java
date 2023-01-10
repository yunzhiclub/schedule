package com.yunzhi.schedule.service;


import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService{
    private final ScheduleRepository scheduleRepository;
    private final TermService termService;
    public ScheduleServiceImpl(ScheduleRepository scheduleRepository, TermService termService) {
        this.scheduleRepository = scheduleRepository;
        this.termService = termService;
    }

    @Override
    public List<Schedule> clazzesHaveSelectCourse(Long courseId) {
        Term term = this.termService.getCurrentTerm();
        return this.scheduleRepository.findSchedulesByCourseIdAndTermId(courseId, term.getId());
    }
}
