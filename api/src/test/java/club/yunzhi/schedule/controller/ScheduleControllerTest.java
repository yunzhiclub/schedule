package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.entity.*;
import club.yunzhi.schedule.entity.*;
import club.yunzhi.schedule.service.ScheduleService;
import club.yunzhi.schedule.service.TermService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.*;

class ScheduleControllerTest extends ControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    ScheduleService scheduleService;
    @MockBean
    TermService termService;


    @Test
    void GetByIdJsonView() throws Exception {
        Schedule schedule = getFullScheduleObject();

        Mockito.doReturn(schedule).when(this.scheduleService).getById(Mockito.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.get("/schedule/" + schedule.getId()))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.clazzes").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.clazzes[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.clazzes[0].name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.course").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.course.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.course.name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.course.hours").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.term").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.term.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.term.endTime").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.term.startTime").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.term.name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.teacher1").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.teacher1.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.teacher1.name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.teacher2").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].week").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].day").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].lesson").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].rooms").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].rooms[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].rooms[0].name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.course.schedules").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.teacher1.schedules1").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.teacher1.schedules2").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedules").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].rooms[0].dispatches").doesNotHaveJsonPath())
        ;
    }

    @Test
    void GetSchedulesInCurrentTerm() throws Exception {
        Schedule schedule = getFullScheduleObject();

        Mockito.doReturn(new Term()).when(this.termService).getCurrentTerm();
        Mockito.doReturn(Collections.singletonList(schedule)).when(this.scheduleService).getSchedulesByTerm(Mockito.any(Term.class));

        mockMvc.perform(MockMvcRequestBuilders.get("/schedule/getSchedulesInCurrentTerm"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].clazzes").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].clazzes[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].clazzes[0].name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].course").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].course.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].course.name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].course.hours").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].teacher1").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].teacher1.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].teacher1.name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].teacher2").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].week").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].day").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].lesson").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].rooms").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].rooms[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].rooms[0].name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].course.schedules").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].teacher1.schedules1").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].teacher1.schedules2").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].schedules").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches[0].rooms[0].dispatches").doesNotHaveJsonPath())
        ;
    }

    public static Schedule getFullScheduleObject() {
        Dispatch dispatch = new Dispatch();
        Room room = new Room();
        room.setDispatches(Collections.singletonList(dispatch));
        dispatch.setRooms(Collections.singletonList(room));
        Schedule schedule = new Schedule();
        Course course = new Course();
        course.setSchedules(Collections.singletonList(schedule));
        Teacher teacher1 = new Teacher();
        Teacher teacher2 = new Teacher();
        teacher1.setSchedules1(Collections.singletonList(schedule));
        teacher1.setSchedules2(Collections.singletonList(schedule));
        teacher2.setSchedules1(Collections.singletonList(schedule));
        teacher2.setSchedules2(Collections.singletonList(schedule));
        Clazz clazz = new Clazz();

        schedule.setId(new Random().nextLong());
        dispatch.setSchedule(schedule);
        schedule.setDispatches(Collections.singletonList(dispatch));
        schedule.setClazzes(Collections.singletonList(clazz));
        schedule.setTeacher1(teacher1);
        schedule.setTeacher2(teacher2);
        schedule.setTerm(new Term());
        schedule.setCourse(course);
        return schedule;
    }
}