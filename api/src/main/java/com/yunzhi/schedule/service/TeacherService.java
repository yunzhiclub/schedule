package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.entity.Term;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TeacherService {
    Page<Teacher> page(String name, String phone, Pageable pageable);

    Teacher save(Teacher teacher);

    Teacher getById(Long id);

    Teacher update(Long id, Teacher teacher);

    void deleteById(Long id);
}
