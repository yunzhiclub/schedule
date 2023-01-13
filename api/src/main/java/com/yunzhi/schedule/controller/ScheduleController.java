package com.yunzhi.schedule.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.yunzhi.schedule.entity.*;
import com.yunzhi.schedule.service.RoomService;
import com.yunzhi.schedule.service.ScheduleService;
import com.yunzhi.schedule.service.TermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("schedule")
public class ScheduleController {
    private ScheduleService scheduleService;
    private TermService termService;

    @Autowired
    ScheduleController(ScheduleService scheduleService,
                       TermService termService) {
        this.scheduleService = scheduleService;
        this.termService = termService;
    }

    @GetMapping("getSchedulesInCurrentTerm")
    @JsonView(getSchedulesInCurrentTerm.class)
    public List<Schedule> getSchedulesInCurrentTerm() {
        Term term = this.termService.getCurrentTerm();
        return this.scheduleService.getSchedulesInCurrentTerm(term);
    }

    public interface getSchedulesInCurrentTerm extends
            Schedule.ClazzJsonView,
            Schedule.CourseJsonView,
            Schedule.IdJsonView,
            Schedule.Teacher1JsonView,
            Schedule.Teacher2JsonView,
            Schedule.DispatchesJsonView,
            Clazz.IdJsonView,
            Clazz.NameJsonView,
            Course.IdJsonView,
            Course.NameJsonView,
            Course.HoursJsonView,
            Teacher.IdJsonView,
            Teacher.NameJsonView,
            Dispatch.IdJsonView,
            Dispatch.WeekJsonView,
            Dispatch.DayJsonView,
            Dispatch.LessonJsonView,
            Dispatch.RoomsJsonView,
            Room.IdJsonView,
            Room.NameJsonView
    {}
}
