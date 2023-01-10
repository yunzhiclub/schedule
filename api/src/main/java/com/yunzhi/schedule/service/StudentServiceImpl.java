package com.yunzhi.schedule.service;

import com.yunzhi.schedule.entity.Student;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.Arrays;
import java.util.Objects;

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
        Assert.notEmpty(Arrays.asList(
                student.getName(), student.getSno(), student.getClazz(), student.getSex()
        ), "发生校验错误，请检查输入字段");
        return this.studentRepository.save(student);
    }

    @Override
    public Student getByName(String name) {
        return this.studentRepository.findByNameAndDeletedFalse(name).orElseThrow(() -> new EntityNotFoundException("找不到对应实体"));
    }

    @Override
    public Boolean studentNameUnique(String name, Long studentId) {
        // 有异常，C层直接返回false
        // 无异常，如果是已排除的学生，允许名称相同， 返回 false
        //                 其他学生，不允许， 返回 true
        Student student = this.getByName(name);
        if (Objects.equals(student.getId(), studentId)) {
            return false;
        }
        return true;
    }

    @Override
    public Boolean snoUnique(String sno, Long studentId) {
        // 有异常，C层直接返回false
        // 无异常，如果是已排除的学生，允许学号相同， 返回 false
        //                 其他学生，不允许， 返回 true
        Student student = this.getBySno(sno);
        if (Objects.equals(student.getId(), studentId)) {
            return false;
        }
        return true;
    }

    private Student getBySno(String sno) {
        return this.studentRepository.findBySnoAndDeletedFalse(sno).orElseThrow(() -> new EntityNotFoundException("找不到对应实体"));
    }

    @Override
    public void deleteById(Long studentId) {
        this.studentRepository.deleteById(studentId);
    }

    @Override
    public Student getById(Long studentId) {
        return this.studentRepository.findById(studentId).orElseThrow(() -> new EntityNotFoundException("未找到相关实体"));
    }
}
