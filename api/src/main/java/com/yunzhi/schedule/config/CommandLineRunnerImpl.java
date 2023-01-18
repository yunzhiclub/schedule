package com.yunzhi.schedule.config;

import com.yunzhi.schedule.entity.*;
import com.yunzhi.schedule.repository.*;
import net.bytebuddy.utility.RandomString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;


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
    private final ScheduleRepository scheduleRepository;
    private final DispatchRepository dispatchRepository;

    @Autowired
    public CommandLineRunnerImpl(TermRepository termRepository,
                                 TeacherRepository teacherRepository,
                                 StudentRepository studentRepository,
                                 RoomRepository roomRepository,
                                 ClazzRepository clazzRepository,
                                 UserRepository userRepository,
                                 CourseRepository courseRepository,
                                 ScheduleRepository scheduleRepository,
                                 DispatchRepository dispatchRepository) {
        this.termRepository = termRepository;
        this.teacherRepository = teacherRepository;
        this.clazzRepository = clazzRepository;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.scheduleRepository = scheduleRepository;
        this.dispatchRepository = dispatchRepository;
    }

    @Override
    public void run(String... args) {
        User user = new User();
        //角色为系统管理员
        String password = "yunzhi";
        user.setPhone("13900000000");
        user.setName("系统管理员");
        user.setPassword(Encoder.getMD5Result(password));
        this.userRepository.save(user);

        this.forHePanTest();
//        this.chen();
    }


    private void forHePanTest() {
//        // 添加50条测试学期
//        for (int i = 0; i < 50; i++) {
//            this.addTerm("学期" + i, false, 1672502400L, 1688140800L);
//        }
//
//        // 添加50条测试老师
//        for (int i = 0; i < 50; i++) {
//            this.addTeacher("老师" + i, false,  "1688140800");
//        }
//
//        // 添加50条测试班级
//        for (int i = 0; i < 50; i++) {
//            this.addClazz("班级" + i, 1672502400L);
//        }
//
//        Clazz clazzA = this.addClazz("班级A", 1672502400L);
//        // 添加50条测试学生
//        for (int i = 0; i < 50; i++) {
//            this.addStudent("学生" + i, true, RandomString.make(6), clazzA);
//        }
//
//        // 添加50条测试教室
//        for (int i = 0; i < 50; i++) {
//            this.addRoom("教室" + i,  RandomString.make(2));
//        }
//
//        // 添加50条测试课程
//        for (int i = 0; i < 50; i++) {
//            this.addCourse("课程" + i,  RandomString.make(2));
//        }

        Term term1 = this.addTerm("已激活学期", true, 1672502400L, 1688140800L);
        Term term0 = this.addTerm("未激活学期", false, 1672502400L, 1688140800L);

        // 添加测试教师
        Teacher teacher1 = this.addTeacher("张三", true, "13100000000");
        Teacher teacher2 = this.addTeacher("李四", false, "13100000001");
        Teacher teacher3 = this.addTeacher("王五", true, "13100000000");
        Teacher teacher4 = this.addTeacher("赵六", false, "13100000001");

        // 添加测试教室
        Room room1 = this.addRoom("A1",  RandomString.make(2));
        Room room2 = this.addRoom("B1",  RandomString.make(2));
        Room room3 = this.addRoom("C1",  RandomString.make(2));
        List<Room> rooms = new ArrayList<>();
        rooms.add(room1);
        rooms.add(room2);
        List<Room> rooms3 = new ArrayList<>();
        rooms3.add(room3);

        // 添加测试班级
        Clazz clazz1 = this.addClazz("计科221", 1672502400L);
        Clazz clazz2 = this.addClazz("计科222", 1672502400L);
        List<Clazz> clazzes = new ArrayList<>();
        clazzes.add(clazz1);
        clazzes.add(clazz2);

        // 添加测试课程
        Course course = this.addCourse("计算机组成原理", "6");
        Course cours0 = this.addCourse("汇编语言", "6");

        // 添加测试排课
//        Schedule schedule1 = this.addSchedule(course, term1, teacher1, teacher2, clazzes);
//        Schedule schedule2 = this.addSchedule(cours0, term1, teacher2, teacher4, clazzes);
//        Schedule schedule0 = this.addSchedule(cours0, term0, teacher3, teacher4, clazzes);

        // 添加测试调度
//        this.addDispatch(schedule1, 1L, 1L, 1L, rooms);
//        this.addDispatch(schedule1, 2L, 1L, 1L, rooms);
//        this.addDispatch(schedule1, 3L, 1L, 1L, rooms);
//
//        this.addDispatch(schedule1, 7L, 1L, 1L, rooms3);
//        this.addDispatch(schedule1, 8L, 1L, 1L, rooms3);
//        this.addDispatch(schedule1, 9L, 1L, 1L, rooms3);
//
//        this.addDispatch(schedule2, 4L, 2L, 2L, rooms);
//        this.addDispatch(schedule2, 5L, 2L, 2L, rooms);
//        this.addDispatch(schedule2, 6L, 2L, 2L, rooms);
//
//        this.addDispatch(schedule0, 1L, 2L, 2L, rooms);
//        this.addDispatch(schedule0, 2L, 2L, 2L, rooms);
//        this.addDispatch(schedule0, 3L, 2L, 2L, rooms);
    }


    private void chen() {
        Term term = this.addTerm("已激活学期", true, 1672502400L, 1688140800L);
        Teacher teacher1 = this.addTeacher("张三", true, "13100000000");
        Teacher teacher2 = this.addTeacher("李四", false, "13100000001");
        Teacher teacher3 = this.addTeacher("王五", false, "13100000002");
        Teacher teacher4 = this.addTeacher("赵六", false, "13100000003");
        Course course1 = this.addCourse("计算机组成原理", "6");
        Course course2 = this.addCourse("汇编", "6");

        Clazz clazz1 = this.addClazz("计科221", 1672502400L);
        Clazz clazz2 = this.addClazz("软件221", 1672502400L);
        Clazz clazz3 = this.addClazz("物联网221", 1672502400L);

        Student student1 = this.addStudent("学生1", true, "123123", clazz1);

        Schedule schedule1 = this.addSchedule(course1, term, teacher1, teacher3, Collections.singletonList(clazz1));
        Schedule schedule2 = this.addSchedule(course2, term, teacher2, teacher3, Collections.singletonList(clazz2));


        // 添加测试教室
        Room room1 = this.addRoom("A1",  new Random().nextLong() + "");
        Room room2 = this.addRoom("A2",  new Random().nextLong() + "");
        List<Room> rooms1 = new ArrayList<>();
        rooms1.add(room1);
        List<Room> rooms2 = new ArrayList<>();
        rooms2.add(room2);

        this.addDispatch(schedule1, 1L, 1L, 2L, rooms1);
        this.addDispatch(schedule1, 2L, 1L, 2L, rooms1);
        this.addDispatch(schedule1, 3L, 1L, 2L, rooms1);

        this.addDispatch(schedule2, 4L, 1L, 2L, rooms2);
        this.addDispatch(schedule2, 5L, 1L, 2L, rooms2);
        this.addDispatch(schedule2, 6L, 1L, 2L, rooms2);

    }

    private Dispatch addDispatch(Schedule schedule, Long week, Long day, Long lesson, List<Room> rooms) {
        Dispatch dispatch = new Dispatch();
        dispatch.setSchedule(schedule);
        dispatch.setWeek(week);
        dispatch.setDay(day);
        dispatch.setLesson(lesson);
        dispatch.setRooms(rooms);
        return this.dispatchRepository.save(dispatch);
    }

    private Schedule addSchedule(Course course, Term term, Teacher teacher1, Teacher teacher2, List<Clazz> clazzes) {
        Schedule schedule = new Schedule();
        schedule.setCourse(course);
        schedule.setTerm(term);
        schedule.setTeacher1(teacher1);
        schedule.setTeacher2(teacher2);
        schedule.setClazzes(clazzes);
        return this.scheduleRepository.save(schedule);
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
