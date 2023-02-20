package com.yunzhi.schedule.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.yunzhi.schedule.entity.*;
import com.yunzhi.schedule.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("course")
public class CourseController {
    private final CourseService courseService;

    @Autowired
    CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /**
     * 分页接口.
     * @param name     名称
     * @param hours    课时
     * @return 分页课程
     */
    @GetMapping("/page")
    @JsonView(PageJsonView.class)
    public Page<Course> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String hours,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        return this.courseService.page(name, hours, pageable);
    }

    /**
     * 删除课程
     * @param id   删除课程的id
     */
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        this.courseService.deleteById(id);
    }

    /**
     * 新增课程
     * @param course   新增课程数据
     * @return 课程
     */
    @PostMapping("add")
    @ResponseStatus(HttpStatus.CREATED)
    @JsonView(GetByIdJsonView.class)
    public Course save(@RequestBody Course course) {
        return this.courseService.save(course);
    }

    /**
     * 通过id获取课程
     * @param id   课程id
     * @return     课程
     */
    @GetMapping("getById/{id}")
    @JsonView(GetByIdJsonView.class)
    public Course getById(@PathVariable Long id) {
        return this.courseService.getById(id);
    }

    /**
     * 更新课程
     * @param course   更新后的课程数据
     * @return 课程
     */
    @PostMapping("update/{id}")
    @JsonView(GetByIdJsonView.class)
    public Course update(@PathVariable Long id,
                       @RequestBody Course course) {
        return this.courseService.update(id, course);
    }

    /**
     * 通过所有课程
     * @return     课程
     */
    @GetMapping("getAll")
    @JsonView(GetAllJsonView.class)
    public List<Course> getAll() {
        return this.courseService.getAll();
    }

    @GetMapping("getForCourseDetail/{courseId}")
    @JsonView(GetForCourseDetailJsonView.class)
    public Course getForCourseDetail(@PathVariable Long courseId) {
        Course course = this.courseService.getById(courseId);
//        course.setSchedules(course.getSchedules().stream().filter(schedule -> !schedule.getDeleted()).collect(Collectors.toList()));
//        course.getSchedules().forEach(schedule -> {
//            schedule.setClazzes(schedule.getClazzes().stream().filter(clazz -> !clazz.getDeleted()).collect(Collectors.toList()));
//            schedule.setDispatches(schedule.getDispatches().stream().filter(dispatch -> !dispatch.getDeleted()).collect(Collectors.toList()));
//            schedule.getDispatches().forEach(dispatch -> {
//                dispatch.setRooms(dispatch.getRooms().stream().filter(room -> !room.getDeleted()).collect(Collectors.toList()));
//            });
//            if (schedule.getTeacher1().getDeleted()) {
//                schedule.setTeacher1(new Teacher());
//            }
//            if (schedule.getTeacher2().getDeleted()) {
//                schedule.setTeacher2(new Teacher());
//            }
//        });
        return course;
    }

    public interface GetByIdJsonView extends
            Course.IdJsonView,
            Course.NameJsonView,
            Course.HoursJsonView
    {}
    public interface GetAllJsonView extends
            GetByIdJsonView
    {}
    public interface PageJsonView extends
            GetByIdJsonView
    {}

    public interface GetForCourseDetailJsonView extends
            GetByIdJsonView,
            Course.SchedulesJsonView,
            Schedule.IdJsonView,
            Schedule.TermJsonView,
            Term.IdJsonView,
            Schedule.DispatchesJsonView,
            Dispatch.IdJsonView,
            Dispatch.DayJsonView,
            Dispatch.LessonJsonView,
            Dispatch.WeekJsonView,
            Schedule.ClazzJsonView,
            Clazz.IdJsonView,
            Clazz.NameJsonView,
            Schedule.Teacher1JsonView,
            Schedule.Teacher2JsonView,
            Teacher.IdJsonView,
            Teacher.NameJsonView,
            Dispatch.RoomsJsonView,
            Room.NameJsonView
    {}

}
