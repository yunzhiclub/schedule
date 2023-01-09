package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Student;
import com.yunzhi.schedule.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {

    StudentRepository studentRepository;

    StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public Page<Student> page(String name, String sno, Long clazzId,  Pageable pageable) {
        return this.studentRepository.findAllByNameAndSnoAndClazzId(name, sno, clazzId, pageable);
    }

    @Override
    public Student add(Student student) {
        return null;
    }

    @Override
    public Student getByName(String name) {
        return null;
    }

    @Override
    public Boolean studentNameUnique(String name, Long studentId) {
        return null;
    }

    @Override
    public Boolean snoUnique(String name, Long studentId) {
        return null;
    }

    @Override
    public void deleteById(Long studentId) {

    }

    @Override
    public Student getById(Long studentId) {
        return null;
    }
}
