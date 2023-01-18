package com.yunzhi.schedule.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.yunzhi.schedule.entity.*;
import com.yunzhi.schedule.service.DispatchService;
import com.yunzhi.schedule.service.ScheduleService;
import com.yunzhi.schedule.service.TermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("schedule")
public class ScheduleController {
    private ScheduleService scheduleService;
    private TermService termService;
    private DispatchService dispatchService;

    @Autowired
    ScheduleController(ScheduleService scheduleService,
                       TermService termService,
                       DispatchService dispatchService) {
        this.scheduleService = scheduleService;
        this.termService = termService;
        this.dispatchService = dispatchService;
    }

    @GetMapping("getSchedulesInCurrentTerm")
    @JsonView(GetSchedulesInCurrentTerm.class)
    public List<Schedule> getSchedulesInCurrentTerm() {
        Term term = this.termService.getCurrentTerm();
        List<Schedule> schedules = this.scheduleService.getSchedulesInCurrentTerm(term);
        return schedules;
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
        Page<Schedule> schedulePage = this.scheduleService.page(courseName, termName, clazzName, teacherName, pageable);
        schedulePage.getContent().forEach(schedule -> {
            schedule.getDispatches().forEach(dispatch -> {
                dispatch.setSchedule(null);
            });
            schedule.getClazzes().forEach(clazz -> {
                clazz.getStudents().forEach(student -> {
                    student.setClazz(null);
                });
            });
            schedule.getTeacher1().setSchedules1(null); schedule.getTeacher1().setSchedules2(null);
            schedule.getTeacher2().setSchedules1(null); schedule.getTeacher2().setSchedules2(null);
        });
        return schedulePage;
    }

    @PostMapping
    public Schedule add(@RequestBody Schedule schedule) {
        this.scheduleService.add(schedule);
        this.dispatchService.addBySchedule(schedule);
        return schedule;
    }

    @GetMapping("{id}")
    @JsonView(GetById.class)
    public Schedule getById(@PathVariable Long id) {
        Schedule schedule = this.scheduleService.getById(id);
        schedule.setDispatches(schedule.getDispatches()
                .stream().filter(dispatch -> !dispatch.getDeleted()).collect(Collectors.toList()));
        return schedule;
    };

    @PostMapping("{scheduleId}")
    @JsonView(GetById.class)
    public Schedule edit(@PathVariable Long scheduleId,
                         @RequestBody List<Dispatch> dispatches) {
        Schedule schedule = this.scheduleService.getById(scheduleId);
        this.dispatchService.deleteBySchedule(schedule);
        schedule.setDispatches(dispatches);
        this.dispatchService.addBySchedule(schedule);
        return schedule;
    }

    @DeleteMapping("{scheduleId}")
    public void deleteById(@PathVariable Long scheduleId) {
        Schedule schedule = this.scheduleService.getById(scheduleId);
        this.dispatchService.deleteBySchedule(schedule);
        this.scheduleService.deleteById(scheduleId);
    }

    public interface GetSchedulesInCurrentTerm extends
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

    public interface GetById extends
            Schedule.ClazzJsonView,
            Schedule.TermJsonView,
            Schedule.CourseJsonView,
            Schedule.IdJsonView,
            Schedule.Teacher1JsonView,
            Schedule.Teacher2JsonView,
            Schedule.DispatchesJsonView,
            Clazz.NameJsonView,
            Clazz.IdJsonView,
            Teacher.NameJsonView,
            Term.NameJsonView,
            Course.NameJsonView,
            Course.IdJsonView,
            Course.HoursJsonView,
            Teacher.IdJsonView,
            Dispatch.RoomsJsonView,
            Dispatch.LessonJsonView,
            Dispatch.DayJsonView,
            Dispatch.WeekJsonView,
            Room.IdJsonView
    {}


}
