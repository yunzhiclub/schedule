package com.yunzhi.schedule.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.yunzhi.schedule.entity.*;
import com.yunzhi.schedule.service.ScheduleService;
import com.yunzhi.schedule.service.TermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.web.bind.annotation.*;

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

    /**
     * 分页接口.
     * @param pageable 分页数据.
     * @return 分页排课
     */
    @GetMapping("page")
    public Page<Schedule> page(
            @RequestParam(required = false, defaultValue = "") String courseName,
            @RequestParam(required = false, defaultValue = "") String termName,
            @RequestParam(required = false, defaultValue = "") String clazzName,
            @RequestParam(required = false, defaultValue = "") String teacherName,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        return this.scheduleService.page(courseName, termName, clazzName, teacherName, pageable);
    }

    @PostMapping
    public Schedule add(@RequestBody Schedule schedule) {
        return this.scheduleService.add(schedule);
    }

    @GetMapping("{id}")
    public Schedule getById(@PathVariable Long id) {
        return this.scheduleService.getById(id);
    };

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
