package com.yunzhi.schedule.controller;

import com.yunzhi.schedule.entity.Course;
import com.yunzhi.schedule.entity.Schedule;
import com.yunzhi.schedule.entity.User;
import com.yunzhi.schedule.entity.WeChatUser;
import com.yunzhi.schedule.service.CourseService;
import com.yunzhi.schedule.service.UserService;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.Collections;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

class CourseControllerTest extends ControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    CourseService courseService;


    public Course getOneCourse() {
        Course course = new Course();
        course.setName(RandomString.make(6));
        course.setId(new Random().nextLong());
        course.setHours(new Random().nextLong() + "");
        course.setSchedules(ScheduleControllerTest.getFullScheduleObject().getCourse().getSchedules());
        return course;
    }



    @Test
    void getByIdJsonView() throws Exception {
        Course course = getOneCourse();

        Mockito.doReturn(course).when(this.courseService).getById(Mockito.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.get("/course/getById/" + course.getId()))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.hours").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules").doesNotExist());
    }
    @Test
    void GetForCourseDetailJsonView() throws Exception {
        Course course = getOneCourse();

        Mockito.doReturn(course).when(this.courseService).getById(Mockito.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.get("/course/getForCourseDetail/" + course.getId()))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.hours").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].term").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].term.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches[0].day").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches[0].lesson").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches[0].week").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches[0].rooms").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches[0].rooms[0].name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].clazzes").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].clazzes[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].clazzes[0].name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].teacher1").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].teacher2").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].teacher2.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].teacher2.name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].teacher2.schedules").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].course").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].clazzes[0].schedules").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches[0].schedules").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.schedules[0].dispatches[0].rooms[0].dispatches").doesNotHaveJsonPath())
        ;
    }

    @Test
    void GetAllJsonView() throws Exception {
        this.getByIdJsonView();
    }

    @Test
    void PageJsonView() throws Exception {
        this.getByIdJsonView();
    }


}