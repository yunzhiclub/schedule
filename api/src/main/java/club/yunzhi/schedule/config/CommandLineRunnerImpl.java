package club.yunzhi.schedule.config;

import club.yunzhi.schedule.entity.*;
import club.yunzhi.schedule.repository.*;
import club.yunzhi.schedule.entity.*;
import club.yunzhi.schedule.repository.*;
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
        if (this.userRepository.findByPhoneAndDeletedFalse("13920618851") == null) {
            User user = new User();
            //角色为系统管理员
            String password = "yunzhi";
            user.setPhone("13920618851");
            user.setName("张三");
            user.setPassword(password);
            this.userRepository.save(user);
        }
//        this.forHePanTest();
//        this.chen();
    }   


    private void forHePanTest() {
        // 添加60条测试学期
        for (int i = 0; i < 58; i++) {
            this.addTerm("学期" + i, false, 1672502400L, 1688140800L);
        }
        Term term = this.addTerm("2023春季学期", true, 1672502400L, 1688140800L);
        this.addTerm("2023秋季学期", false, 1672502400L, 1688140800L);
        // 添加60条测试老师
        for (int i = 0; i < 54; i++) {
            this.addTeacher("老师" + i, false,  "131000000" + (i + 10));
        }
        Teacher zhangsan = this.addTeacher("张三", true, "13100000001");
        Teacher lisi = this.addTeacher("李四", false, "13100000002");
        Teacher wangwu = this.addTeacher("王五", false, "13100000003");
        Teacher zhaoliu = this.addTeacher("赵六", true, "13100000004");
        Teacher sunqi = this.addTeacher("孙七", false, "13100000005");
        Teacher zhouba = this.addTeacher("周八", true, "13100000006");
        Teacher huangjiu = this.addTeacher("黄九", false, "13100000007");
        Teacher tianshi = this.addTeacher("田十", true, "13100000008");
        Teacher mengshiyi = this.addTeacher("孟十一", false, "13100000009");
        // 添加60条测试班级
        for (int i = 0; i < 60; i++) {
            Clazz clazz =  this.addClazz("班级" + i, 1672502400L);
            // 每个班级添加15条测试学生
            for (int j = 0; j < 15; j++) {
                this.addStudent("学生" + j + "-" + clazz.getName(), true, RandomString.make(6), clazz);
            }
        }
        // 添加60条测试教室
        for (int i = 0; i < 60; i++) {
            Room room = this.addRoom("教室" + i,  RandomString.make(2));
        }
        // 添加60条测试课程
        for (int i = 0; i < 54; i++) {
            this.addCourse("课程" + i,  RandomString.make(2));
        }
        Course jsjzcyl = this.addCourse("计算机组成原理", "36");
        Course hbyy = this.addCourse("汇编语言", "36");
        Course Cyycxsj = this.addCourse("C语言程序设计", "48");
        Course gdsx = this.addCourse("高等数学", "42");
        Course lssx = this.addCourse("离散数学", "30");
        Course sjjg = this.addCourse("数据结构", "36");
    }


    private void chen() {
        Term term = this.addTerm("已激活学期", true, 1672502400L, 1688140800L);
        Term term0 = this.addTerm("未激活学期", false, 1672502400L, 1688140800L);

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

        Schedule schedule1 = this.addSchedule(course2, term, teacher1, teacher2, Collections.singletonList(clazz1));
        Schedule schedule2 = this.addSchedule(course1, term, teacher2, teacher3, Collections.singletonList(clazz2));
        Schedule schedule3 = this.addSchedule(course2, term, teacher3, teacher4, Collections.singletonList(clazz2));


        // 添加测试教室
        Room room1 = this.addRoom("A1",  new Random().nextLong() + "");
        Room room2 = this.addRoom("A2",  new Random().nextLong() + "");
        List<Room> rooms1 = new ArrayList<>();
        rooms1.add(room1);
        List<Room> rooms2 = new ArrayList<>();
        rooms2.add(room2);

        this.addDispatch(schedule1, 7L, 1L, 2L, rooms1);
        this.addDispatch(schedule1, 8L, 1L, 2L, rooms1);
        this.addDispatch(schedule1, 9L, 1L, 2L, rooms1);

        this.addDispatch(schedule2, 4L, 1L, 2L, rooms1);
        this.addDispatch(schedule2, 5L, 1L, 2L, rooms1);
        this.addDispatch(schedule2, 6L, 1L, 2L, rooms1);

        this.addDispatch(schedule3, 7L, 1L, 2L, rooms2);
        this.addDispatch(schedule3, 8L, 1L, 2L, rooms2);
        this.addDispatch(schedule3, 9L, 1L, 2L, rooms2);

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
        clazz.setStudentNumber(30L);
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
