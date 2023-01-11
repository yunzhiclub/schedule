package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.Clazz;
import com.yunzhi.schedule.service.ClazzService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@RequestMapping("clazz")
public class ClazzController {
    private ClazzService clazzService;

    @Autowired
    ClazzController(ClazzService clazzService) {
        this.clazzService = clazzService;
    }

    /**
     * 分页接口.
     * @param name     名称
     * @param pageable 分页数据.
     * @return 分页教师
     */
    @GetMapping("/page")
    public Page<Clazz> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        Page<Clazz> page = this.clazzService.page(name, pageable);
        System.out.println(name);
        return page;
    }

    @GetMapping("clazzNameUnique")
    public Boolean clazzNameUnique(@RequestParam String name,
                                  @RequestParam Long clazzId) {
        try {
            return this.clazzService.clazzNameUnique(name, clazzId);
        } catch (EntityNotFoundException e) {
            return false;
        }
    }

    /**
     * 新增班级接口.
     * @param clazz 班级
     * @return 班级
     */
    @PostMapping
    public Clazz add(@RequestBody Clazz clazz) {
        return this.clazzService.add(clazz);
    }

    @DeleteMapping("{clazzId}")
    public void deleteById(@PathVariable Long clazzId) {
        this.clazzService.deleteById(clazzId);
    }

    @GetMapping("{clazzId}")
    public Clazz getById(@PathVariable Long clazzId) {
        return this.clazzService.getById(clazzId);
    }

    @GetMapping("getAll")
    public List<Clazz> getAll() {
        return this.clazzService.getAll();
    }

    /**
     * 选择某个课程的所有班级ID
     */
    @GetMapping("clazzesHaveSelectCourse/{courseId}")
    public List<Long> clazzesHaveSelectCourse(@PathVariable Long courseId) {
        return this.clazzService.clazzIdsHaveSelectCourse(courseId);
    }

}
