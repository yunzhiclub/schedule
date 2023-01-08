package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.service.TeacherService;
import com.yunzhi.schedule.service.TermService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("teacher")
public class TeacherController {
    private TeacherService teacherService;

    @Autowired
    TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    /**
     * 分页接口.
     * @param name     名称
     * @param pageable 分页数据.
     * @return 分页教师
     */
    @GetMapping("/page")
    public Page<Teacher> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        Page<Teacher> page = this.teacherService.page(name, pageable);
        return page;
    }

    /**
     * 新增教师
     * @param teacher   新增教师数据
     * @return 教师
     */
    @PostMapping("add")
    @ResponseStatus(HttpStatus.CREATED)
    public Teacher save(@RequestBody Teacher teacher) {
        return this.teacherService.save(teacher);
    }

    /**
     * 通过id获取教师
     * @param id   教师id
     * @return 教师
     */
    @GetMapping("getById/{id}")
    public Teacher getByUserId(@PathVariable Long id) {
        return this.teacherService.getById(id);
    }

    /**
     * 新增教师
     * @param teacher   更新后的教师数据
     * @return 教师
     */
    @PostMapping("update/{id}")
    public Teacher update(@PathVariable Long id,
                          @RequestBody Teacher teacher) {
        return this.teacherService.update(id, teacher);
    }
}
