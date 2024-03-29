package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.service.ClazzService;
import com.fasterxml.jackson.annotation.JsonView;
import club.yunzhi.schedule.entity.Clazz;
import club.yunzhi.schedule.entity.Schedule;
import club.yunzhi.schedule.entity.Term;
import club.yunzhi.schedule.service.ScheduleService;
import club.yunzhi.schedule.service.TermService;
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
    private final ClazzService clazzService;
    private final TermService termService;

    private final ScheduleService scheduleService;

    @Autowired
    ClazzController(ClazzService clazzService,
                    ScheduleService scheduleService,
                    TermService termService) {
        this.clazzService = clazzService;
        this.termService = termService;
        this.scheduleService = scheduleService;
    }

    /**
     * 分页接口.
     * @param name     名称
     * @param pageable 分页数据.
     * @return 分页教师
     */
    @GetMapping("/page")
    @JsonView(PageJsonView.class)
    public Page<Clazz> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        return this.clazzService.page(name, pageable);
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
    @JsonView(GetByIdJsonView.class)
    public Clazz getById(@PathVariable Long clazzId) {
        return this.clazzService.getById(clazzId);
    }

    @GetMapping("getAll")
    @JsonView(GetAllJsonView.class)
    public List<Clazz> getAll() {
        return this.clazzService.getAll();
    }

    /**
     * 选择某个课程的所有班级ID
     */
    @GetMapping("clazzesHaveSelectCourse/{courseId}")
    public List<Long> clazzesHaveSelectCourse(@PathVariable Long courseId) {
        Term currentTerm = this.termService.getCurrentTerm();
        List<Schedule> schedules = this.scheduleService.getAllByCourseIdAndTermId(courseId, currentTerm.getId());
        return this.clazzService.getClazzIdsBySchedules(schedules);
    }

    /**
     * 更新班级
     * @param clazz   更新后的班级数据
     * @return 班级
     */
    @PostMapping("update/{id}")
    public Clazz update(@PathVariable Long id,
                       @RequestBody Clazz clazz) {
        return this.clazzService.update(id, clazz);
    }

    private class GetAllJsonView implements
            Clazz.NameJsonView,
            Clazz.IdJsonView,
            Clazz.StudentNumberJsonView
    {}

    private class PageJsonView implements
            Clazz.IdJsonView,
            Clazz.NameJsonView,
            Clazz.EntranceDateJsonView,
            Clazz.StudentNumberJsonView
    {}
    private class GetByIdJsonView implements
            Clazz.IdJsonView,
            Clazz.NameJsonView,
            Clazz.EntranceDateJsonView,
            Clazz.StudentNumberJsonView
    {}
}
