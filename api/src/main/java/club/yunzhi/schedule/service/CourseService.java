package club.yunzhi.schedule.service;

import club.yunzhi.schedule.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseService {
    Page<Course> page(String name, String hours, Pageable pageable);

    void deleteById(Long id);

    Course save(Course course);

    Course getById(Long id);

    Course update(Long id, Course course);

    List<Course> getAll();
}
