package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.service.TeacherService;
import club.yunzhi.schedule.entity.Teacher;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Collections;
import java.util.Random;

class TeacherControllerTest extends ControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    TeacherService teacherService;


    public Teacher getOneTeacher() {
        Teacher teacher = new Teacher();
        teacher.setName(RandomString.make(6));
        teacher.setId(new Random().nextLong());
        teacher.setSchedules1(Collections.singletonList(ScheduleControllerTest.getFullScheduleObject()));
        teacher.setSchedules2(Collections.singletonList(ScheduleControllerTest.getFullScheduleObject()));
        teacher.setPhone(new Random().nextLong() + "");
        teacher.setSex(new Random().nextBoolean());
        return teacher;
    }

    @Test
    void getByIdJsonView() throws Exception {
        Teacher teacher = getOneTeacher();

        Mockito.doReturn(teacher).when(this.teacherService).getById(Mockito.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.get("/teacher/getById/" + teacher.getId()))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.sex").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.phone").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules1").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules2").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules1[0].teacher1").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules1[0].teacher2").doesNotHaveJsonPath())
        ;
    }
    @Test
    void PageJsonView() throws Exception {

        Page<Teacher> teacherPage = new PageImpl<Teacher>(Collections.singletonList(getOneTeacher()));
        Mockito.doReturn(teacherPage).when(this.teacherService).page(Mockito.anyString(), Mockito.anyString(), Mockito.any(Pageable.class));

        mockMvc.perform(MockMvcRequestBuilders.get("/teacher/page"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].sex").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].phone").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].dispatches").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].dispatches[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].term").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].term.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules2").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].teacher1").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].teacher2").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].clazzes").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].dispatches[0].schedules").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].schedules1[0].course").doesNotHaveJsonPath())
        ;
    }
    @Test
    void GetAllJsonView() throws Exception {
        Teacher teacher = getOneTeacher();

        Mockito.doReturn(Collections.singletonList(teacher)).when(this.teacherService).getAll();

        mockMvc.perform(MockMvcRequestBuilders.get("/teacher/getAll"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].schedules1").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].schedules2").doesNotHaveJsonPath())
        ;
    }

}