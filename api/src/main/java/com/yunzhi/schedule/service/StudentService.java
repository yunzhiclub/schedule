package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public interface StudentService {

    /**
     * 增加学生
     * @param student 学生
     * @return 学生
     */
    Student add(Student student);

    Student getByName(String name);

    /**
     * 学生名称是否存在
     * @param name 学生名
     * @param studentId 排除此学生
     * @return 学生
     */
    Boolean studentNameUnique(String name, Long studentId);

    Boolean snoUnique(String name, Long studentId);

    /**
     * 删除学生
     */
    void deleteById(Long studentId);


    Student getById(Long studentId);

    Student update(Long id, Student student);



    void downloadImportTemplate(OutputStream outputStream) throws IOException;

    void importExcel(InputStream inputStream, OutputStream outputStream) throws IOException;

    Page<Student> page(Long clazzId, String clazzName, String name, String sno, Pageable pageable);
}
