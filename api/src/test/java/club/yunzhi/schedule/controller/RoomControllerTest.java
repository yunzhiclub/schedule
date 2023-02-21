package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.service.RoomService;
import club.yunzhi.schedule.entity.Room;
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

import java.util.*;

class RoomControllerTest extends ControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    RoomService roomService;


    public Room getOneRoom() {
        Room room = new Room();
        room.setName(RandomString.make(6));
        room.setId(new Random().nextLong());
        room.setDispatches(ScheduleControllerTest.getFullScheduleObject().getDispatches());
        room.setCapacity(new Random().nextLong() + "");
        return room;
    }

    @Test
    void getByIdJsonView() throws Exception {
        Room room = getOneRoom();

        Mockito.doReturn(room).when(this.roomService).getById(Mockito.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.get("/room/getById/" + room.getId()))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.capacity").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches").doesNotHaveJsonPath());
    }
    @Test
    void PageJsonView() throws Exception {
        Page<Room> clazzPage = new PageImpl<Room>(Collections.singletonList(getOneRoom()));
        Mockito.doReturn(clazzPage).when(this.roomService).page(Mockito.anyString(), Mockito.anyString(), Mockito.any(Pageable.class));

        mockMvc.perform(MockMvcRequestBuilders.get("/room/page"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].capacity").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].dispatches").doesNotHaveJsonPath());
    }
    @Test
    void GetAllJsonView() throws Exception {
        Room room = getOneRoom();

        Mockito.doReturn(Collections.singletonList(room)).when(this.roomService).getAll();

        mockMvc.perform(MockMvcRequestBuilders.get("/room/getAll"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].capacity").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].dispatches").doesNotHaveJsonPath());
    }
    @Test
    void GetForRoomDetail() throws Exception {
        Room room = getOneRoom();

        Mockito.doReturn(room).when(this.roomService).getById(Mockito.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.get("/room/getForRoomDetail/" + room.getId()))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.capacity").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].day").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].lesson").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].week").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.term").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.term.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.clazzes").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.clazzes[0].id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.clazzes[0].name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.teacher1").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.teacher2").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.teacher2.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.teacher2.name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.course").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.course.id").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.course.name").hasJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].rooms").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.dispatches").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.teacher1.schedules1").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.teacher1.schedules2").doesNotHaveJsonPath())
                .andExpect(MockMvcResultMatchers.jsonPath("$.dispatches[0].schedule.course.schedules").doesNotHaveJsonPath())
        ;
    }

}