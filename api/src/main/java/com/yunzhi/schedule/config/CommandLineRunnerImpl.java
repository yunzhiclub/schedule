package com.yunzhi.schedule.config;

import com.yunzhi.schedule.entity.Room;
import com.yunzhi.schedule.entity.Teacher;
import com.yunzhi.schedule.entity.Term;
import com.yunzhi.schedule.repository.RoomRepository;
import com.yunzhi.schedule.repository.TeacherRepository;
import com.yunzhi.schedule.repository.TermRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


/**
 * 系统启动时添加系统管理员
 */
@Component
public class CommandLineRunnerImpl implements CommandLineRunner {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final TermRepository termRepository;
    private final TeacherRepository teacherRepository;
    private final RoomRepository roomRepository;
    @Autowired
    public CommandLineRunnerImpl(TermRepository termRepository, TeacherRepository teacherRepository, RoomRepository roomRepository) {
        this.termRepository = termRepository;
        this.teacherRepository = teacherRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public void run(String... args) {
        // 添加200条学期数据
        for (int i = 0; i < 200; i+=2) {
            this.addTerm("学期" + i, false, 1672502400L, 1688140800L);
            this.addTerm("学期" + (i + 1), false, 1672502400L, 1688140800L);
        }
        // 添加200条教师数据
        for (int i = 0; i < 200; i+=2) {
            this.addTeacher("教师" + i, true, "13100000000");
            this.addTeacher("教师" + (i + 1), false, "13100000011");
        }
        // 添加200条教室数据
        for (int i = 0; i < 200; i+=2) {
            this.addRoom("教室" + i,  "25");
            this.addRoom("教室" + (i + 1),  "30");
        }
    }

    private Term addTerm(String name, Boolean state, Long startTime, Long endTime) {
        Term term = new Term();
        term.setName(name);
        term.setState(state);
        term.setStartTime(startTime);
        term.setEndTime(endTime);
        return this.termRepository.save(term);
    }

    private Teacher addTeacher(String name, Boolean sex, String phone) {
        Teacher teacher = new Teacher();
        teacher.setName(name);
        teacher.setSex(sex);
        teacher.setPhone(phone);
        return this.teacherRepository.save(teacher);
    }

    private Room addRoom(String name, String capacity) {
        Room room = new Room();
        room.setName(name);
        room.setCapacity(capacity);
        return this.roomRepository.save(room);
    }
}
