package com.yunzhi.schedule.service;


import com.yunzhi.schedule.entity.Clazz;
import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.entity.forType.ForUpdateClazzesAndTeachers;
import com.yunzhi.schedule.repository.ScheduleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService{
    private final ScheduleRepository scheduleRepository;
    private ClazzService clazzService;
    private TeacherService teacherService;
    public ScheduleServiceImpl(ScheduleRepository scheduleRepository,
                               ClazzService clazzService,
                               TeacherService teacherService) {
        this.scheduleRepository = scheduleRepository;
        this.clazzService = clazzService;
        this.teacherService = teacherService;
    }

    @Override
    public List<Schedule> getAllByCourseIdAndTermId(Long courseId, Long termId) {
        return this.scheduleRepository.findSchedulesByCourseIdAndTermIdAndDeletedFalse(courseId, termId);
    }

    @Override
    public List<Schedule> getSchedulesByTerm(Term term) {
        List<Schedule> schedules = this.scheduleRepository.findSchedulesByTermAndDeletedFalse(term);
        schedules.forEach(schedule -> {
            schedule.setDispatches(schedule.getDispatches().stream().filter(dispatch -> !dispatch.getDeleted()).collect(Collectors.toList()));
            schedule.getDispatches().forEach(dispatch -> {
                dispatch.setRooms(dispatch.getRooms().stream().filter(room -> !room.getDeleted()).collect(Collectors.toList()));
            });
        });
        return schedules;
    }

    @Override
    public Page<Schedule> page(String courseName, Long termId, String clazzName, String teacherName, Pageable pageable) {
        return this.scheduleRepository.findAll(courseName, termId, clazzName, teacherName, pageable);
    }

    @Override
    public Schedule add(Schedule schedule) {
        return this.scheduleRepository.save(schedule);
    }

    @Override
    public Schedule getById(Long id) {
        return this.scheduleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("未找到相关实体"));
    }

    @Override
    public void deleteById(Long scheduleId) {
        this.scheduleRepository.deleteById(scheduleId);
    }

    @Override
    public void removeClazzFromSchedule(Long scheduleId, Long clazzId) {
        Assert.notNull(scheduleId, "scheduleId不能为null");
        Assert.notNull(clazzId, "clazzId不能为空");
        Schedule schedule = this.getById(scheduleId);

        Clazz clazz = this.clazzService.findById(clazzId);
        schedule.getClazzes().remove(clazz);

        this.scheduleRepository.save(schedule);
    }

    @Override
    public void updateClazzesAndTeachers(ForUpdateClazzesAndTeachers forUpdateClazzesAndTeachers) {
        Assert.notNull(forUpdateClazzesAndTeachers.getScheduleId(), "scheduleId不能为null");
        Schedule schedule = this.getById(forUpdateClazzesAndTeachers.getScheduleId());
        if (forUpdateClazzesAndTeachers.getClazzIds() != null) {
            for (Long clazzId: forUpdateClazzesAndTeachers.getClazzIds()) {
                Clazz clazz = this.clazzService.findById(clazzId);
                schedule.getClazzes().add(clazz);
            }
        }
        Teacher teacher1 = this.teacherService.getById(forUpdateClazzesAndTeachers.getTeacher1Id());
        Teacher teacher2 = this.teacherService.getById(forUpdateClazzesAndTeachers.getTeacher2Id());
        schedule.setTeacher1(teacher1);
        schedule.setTeacher2(teacher2);
        this.scheduleRepository.save(schedule);
    }
}
