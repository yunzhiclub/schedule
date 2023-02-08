package com.yunzhi.schedule.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.yunzhi.schedule.entity.Dispatch;
import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("teacher")
public class TeacherController {
    private final TeacherService teacherService;

    @Autowired
    TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    /**
     * 分页接口.
     * @param name     姓名
     * @param phone    手机号
     * @param pageable 分页数据.
     * @return 分页教师
     */
    @GetMapping("/page")
    @JsonView(PageJsonView.class)
    public Page<Teacher> page(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String phone,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {
        Page<Teacher> teacherPage = this.teacherService.page(name, phone, pageable);
        teacherPage.getContent().forEach(teacher -> {
            teacher.getSchedules1().forEach(schedule -> {
                if (!schedule.getDeleted()) {
                    schedule.setDispatches(schedule.getDispatches().stream().filter(dispatch -> !dispatch.getDeleted()).collect(Collectors.toList()));
                }
            });
            teacher.getSchedules2().forEach(schedule -> {
                if (!schedule.getDeleted()) {
                    schedule.setDispatches(schedule.getDispatches().stream().filter(dispatch -> !dispatch.getDeleted()).collect(Collectors.toList()));
                }
            });
        });
        return teacherPage;
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
    @JsonView(GetById.class)
    public Teacher getById(@PathVariable Long id) {
        return this.teacherService.getById(id);
    }

    /**
     * 更新教师
     * @param teacher   更新后的教师数据
     * @return 教师
     */
    @PostMapping("update/{id}")
    public Teacher update(@PathVariable Long id,
                          @RequestBody Teacher teacher) {
        return this.teacherService.update(id, teacher);
    }

    /**
     * 删除教师
     * @param id   删除教师的id
     * @return 教师
     */
    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        this.teacherService.deleteById(id);
    }

    /**
     * 通过所有教师
     * @return     教师
     */
    @GetMapping("getAll")
    @JsonView(GetAll.class)
    public List<Teacher> getAll() {
        return this.teacherService.getAll();
    }

    /**
     * 教师手机号唯一性验证
     * @return     boolean
     */
    @GetMapping("phoneUnique")
    public Boolean snoUnique(@RequestParam String phone,
                             @RequestParam Long teacherId) {

        try {

            return this.teacherService.phoneUnique(phone, teacherId);
        } catch (EntityNotFoundException e) {
            return false;
        }
    }

    /**
     * 下载导入模板
     *
     * @param response 响应
     * @throws IOException
     */
    @GetMapping("downloadImportTemplate")
    public void downloadImportTemplate(HttpServletResponse response) throws IOException {
        this.teacherService.downloadImportTemplate(response.getOutputStream());
    }

    @PostMapping("importExcel")
    public void importExcel(@RequestParam("file") MultipartFile multipartFile, HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        this.teacherService.importExcel(multipartFile.getInputStream(), response.getOutputStream());
    }

    public interface GetAll extends
            Teacher.NameJsonView,
            Teacher.IdJsonView
    {}

    public interface PageJsonView extends
            Teacher.NameJsonView,
            Teacher.IdJsonView,
            Teacher.PhoneJsonView,
            Teacher.Schedules1JsonView,
            Teacher.Schedules2JsonView,
            Teacher.SexJsonView,
            Schedule.IdJsonView,
            Schedule.DispatchesJsonView,
            Schedule.TermJsonView,
            Term.IdJsonView,
            Dispatch.IdJsonView
    {}
    public interface GetById extends
            Teacher.NameJsonView,
            Teacher.IdJsonView,
            Teacher.SexJsonView,
            Teacher.PhoneJsonView,
            Teacher.Schedules1JsonView,
            Teacher.Schedules2JsonView
    {}
}
