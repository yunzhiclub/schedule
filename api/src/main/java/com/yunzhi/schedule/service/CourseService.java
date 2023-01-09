package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Course;
import com.yunzhi.schedule.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CourseService {
    Page<Course> page(String name, String hours, Pageable pageable);

    void deleteById(Long id);

    Course save(Course course);

    Course getById(Long id);

    Course update(Long id, Course course);
}
