package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Course;
import com.yunzhi.schedule.entity.Room;
import com.yunzhi.schedule.repository.CourseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

@Service
public class CourseServiceImpl implements CourseService{
    private final CourseRepository courseRepository;
    public CourseServiceImpl(CourseRepository courseRepository) {this.courseRepository = courseRepository;}

    @Override
    public Page<Course> page(String name, String hours, Pageable pageable) {
        return this.courseRepository.findAll(name, hours, pageable);
    }

    @Override
    public void deleteById(Long id) {
        this.courseRepository.deleteById(id);
    }

    @Override
    public Course save(Course course) {
        Assert.notNull(course.getName(), "名称不能为空");
        Assert.notNull(course.getHours(), "学时不能为空");
        return this.courseRepository.save(course);
    }

    @Override
    public Course getById(Long id) {
        return this.courseRepository.findById(id).get();
    }

    @Override
    public Course update(Long id, Course course) {
        Assert.notNull(course.getName(), "name不能为null");
        Assert.notNull(course.getHours(), "hours不能为null");
        Course OldCourse = this.getById(id);
        OldCourse.setName(course.getName());
        OldCourse.setHours(course.getHours());
        return this.courseRepository.save(OldCourse);
    }

    @Override
    public List<Course> getAll() {
        return (List<Course>) this.courseRepository.findAll();
    }
}
