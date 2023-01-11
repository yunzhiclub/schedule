package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Course;
import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.repository.TeacherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

@Service
public class TeacherServiceImpl implements TeacherService{
    private final TeacherRepository teacherRepository;

    public TeacherServiceImpl(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    @Override
    public Page<Teacher> page(String name, String phone, Pageable pageable) {
        return this.teacherRepository.findAll(name, phone, pageable);
    }

    @Override
    public Teacher save(Teacher teacher) {
        Assert.notNull(teacher.getName(), "名称不能为空");
        Assert.notNull(teacher.getSex(), "性别不能为空");
        Assert.notNull(teacher.getPhone(), "手机号不能为空");
        return this.teacherRepository.save(teacher);
    }

    @Override
    public Teacher getById(Long id) {
        return this.teacherRepository.findById(id).get();
    }

    @Override
    public Teacher update(Long id, Teacher teacher) {
        Assert.notNull(teacher.getName(), "name不能为null");
        Assert.notNull(teacher.getSex(), "sex不能为null");
        Assert.notNull(teacher.getPhone(), "phone不能为null");
        Teacher OldTeacher = this.getById(id);
        OldTeacher.setName(teacher.getName());
        OldTeacher.setSex(teacher.getSex());
        OldTeacher.setPhone(teacher.getPhone());
        return this.teacherRepository.save(OldTeacher);
    }

    @Override
    public void deleteById(Long id) {
        this.teacherRepository.deleteById(id);
    }

    @Override
    public List<Teacher> getAll() {
        return (List<Teacher>) this.teacherRepository.findAll();
    }
}
