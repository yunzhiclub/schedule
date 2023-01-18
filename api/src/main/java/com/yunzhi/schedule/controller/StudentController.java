package com.yunzhi.schedule.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.yunzhi.schedule.entity.Clazz;
import com.yunzhi.schedule.entity.Student;
import com.yunzhi.schedule.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("student")
public class StudentController {
    private StudentService studentService;

    @Autowired
    StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * 分页接口.
     * @param name     名称
     * @param pageable 分页数据.
     * @return 分页学生
     */
    @GetMapping("/page")
    public Page<Student> page(
            @RequestParam(required = false, defaultValue = "") Long clazzId,
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(required = false, defaultValue = "") String sno,
            @SortDefault.SortDefaults(@SortDefault(sort = "id", direction = Sort.Direction.DESC))
            Pageable pageable) {

        Page<Student> page = this.studentService.page(name, sno, clazzId, pageable);
        page.getContent().forEach(student -> {
            student.getClazz().setStudents(null);
        });
        return page;
    }

    @GetMapping("studentNameUnique")
    public Boolean studentNameUnique(@RequestParam String name,
                                     @RequestParam Long studentId) {
        try {
            return this.studentService.studentNameUnique(name, studentId);
        } catch (EntityNotFoundException e) {
            return false;
        }
    }
    @GetMapping("snoUnique")
    public Boolean snoUnique(@RequestParam String sno,
                             @RequestParam Long studentId) {

        try {

            return this.studentService.snoUnique(sno, studentId);
        } catch (EntityNotFoundException e) {
            return false;
        }
    }

    /**
     * @param student 学生
     * @return 学生
     */
    @PostMapping
    public Student add(@RequestBody Student student) {
        return this.studentService.add(student);
    }

    @DeleteMapping("{studentId}")
    public void deleteById(@PathVariable Long studentId) {
        this.studentService.deleteById(studentId);
    }

    @GetMapping("{studentId}")
    @JsonView(GetById.class)
    public Student getById(@PathVariable Long studentId) {
        return this.studentService.getById(studentId);
    }

    /**
     * 更新学生
     * @param student   更新后的学生数据
     * @return 学生
     */
    @PostMapping("update/{id}")
    public Student update(@PathVariable Long id,
                        @RequestBody Student student) {
        return this.studentService.update(id, student);
    }


    /**
     * 下载导入模板
     *
     * @param response 响应
     * @throws IOException
     */
    @GetMapping("downloadImportTemplate")
    public void downloadImportTemplate(HttpServletResponse response) throws IOException {
        this.studentService.downloadImportTemplate(response.getOutputStream());
    }

    @PostMapping("importExcel")
    public void importExcel(@RequestParam("file") MultipartFile multipartFile, HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        this.studentService.importExcel(multipartFile.getInputStream(), response.getOutputStream());
    }

    public class GetById implements
            Student.IdJsonView,
            Student.NameJsonView,
            Student.SexJsonView,
            Student.ClazzJsonView,
            Student.SnoJsonView,
            Clazz.IdJsonView,
            Clazz.NameJsonView
    {}

}
