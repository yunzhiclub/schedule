package com.yunzhi.schedule.config;

import com.yunzhi.schedule.entity.*;
import com.yunzhi.schedule.repository.*;
import net.bytebuddy.utility.RandomString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Random;


/**
 * 系统启动时添加系统管理员
 */
@Component
public class CommandLineRunnerImpl implements CommandLineRunner {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final TermRepository termRepository;
    private final TeacherRepository teacherRepository;
    private final ClazzRepository clazzRepository;
    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    @Autowired
    public CommandLineRunnerImpl(TermRepository termRepository,
                                 TeacherRepository teacherRepository,
                                 StudentRepository studentRepository,
                                 RoomRepository roomRepository,
                                 ClazzRepository clazzRepository,
                                 UserRepository userRepository,
                                 CourseRepository courseRepository) {
        this.termRepository = termRepository;
        this.teacherRepository = teacherRepository;
        this.clazzRepository = clazzRepository;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(String... args) {

        User user = new User();
        //角色为系统管理员
        Short identity = (short) 2;
        String password = "yunzhi";
        user.setPhone("13900000000");
        user.setName("系统管理员");
        user.setPassword(Encoder.getMD5Result(password));
        this.userRepository.save(user);
        // 添加50条学期数据
        for (int i = 0; i < 50; i++) {
            this.addTerm("学期" + i, false, 1672502400L, 1688140800L);
        }
        // 添加50条教师数据
        for (int i = 0; i < 50; i++) {
            this.addTeacher("教师" + i, true, "13100000000");
        }
        // 添加50条教室数据
        for (int i = 0; i < 50; i++) {
            this.addRoom("教室" + i,  "25");
        }
        // 添加100条班级数据
        for (int i = 0; i < 50; i++) {
            Clazz clazz = this.addClazz("班级" + i, 1672502400L);
            for (int j = 0; j < 20; j++) {
                this.addStudent("学生" + i + '|' + j, new Random().nextBoolean(), RandomString.make(6), clazz);
            }
        }
//         添加50条课程数据
        for (int i = 0; i < 50; i++) {
            this.addCourse("课程" + i,  "25");
        }
    }

    private Student addStudent(String name, Boolean sex, String sno, Clazz clazz) {
        Student student = new Student();
        student.setName(name);
        student.setSex(sex);
        student.setSno(sno);
        student.setClazz(clazz);
        return this.studentRepository.save(student);
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

    private Clazz addClazz(String name, Long entranceDate) {
        Clazz clazz = new Clazz();
        clazz.setName(name);
        clazz.setEntranceDate(entranceDate);
        return this.clazzRepository.save(clazz);
    }

    private Room addRoom(String name, String capacity) {
        Room room = new Room();
        room.setName(name);
        room.setCapacity(capacity);
        return this.roomRepository.save(room);
    }

    private Course addCourse(String name, String hours) {
        Course course = new Course();
        course.setName(name);
        course.setHours(hours);
        return this.courseRepository.save(course);
    }
}
