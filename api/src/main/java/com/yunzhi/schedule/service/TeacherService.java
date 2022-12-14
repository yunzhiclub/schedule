package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Course;
import com.yunzhi.schedule.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TeacherService {
    Page<Teacher> page(String name, String phone, Pageable pageable);

    Teacher save(Teacher teacher);

    Teacher getById(Long id);

    Teacher update(Long id, Teacher teacher);

    void deleteById(Long id);

    List<Teacher> getAll();
}
