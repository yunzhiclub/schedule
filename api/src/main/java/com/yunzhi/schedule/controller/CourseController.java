package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.Course;
import com.yunzhi.schedule.entity.Room;
import com.yunzhi.schedule.service.CourseService;
import com.yunzhi.schedule.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("course")
public class CourseController {
    private CourseService courseService;

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
    public Page<Course> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String hours,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        Page<Course> page = this.courseService.page(name, hours, pageable);
        return page;
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
    public Course save(@RequestBody Course course) {
        return this.courseService.save(course);
    }

    /**
     * 通过id获取课程
     * @param id   课程id
     * @return     课程
     */
    @GetMapping("getById/{id}")
    public Course getById(@PathVariable Long id) {
        return this.courseService.getById(id);
    }

    /**
     * 更新课程
     * @param course   更新后的课程数据
     * @return 课程
     */
    @PostMapping("update/{id}")
    public Course update(@PathVariable Long id,
                       @RequestBody Course course) {
        return this.courseService.update(id, course);
    }

    /**
     * 通过所有课程
     * @return     课程
     */
    @GetMapping("getAll")
    public List<Course> getAll() {
        return this.courseService.getAll();
    }
}
