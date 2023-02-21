package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.entity.Clazz;
import club.yunzhi.schedule.service.ClazzService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

class ClazzControllerTest extends ControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    ClazzService clazzService;


    public Clazz getOneClazz() {
        Clazz clazz = new Clazz();
        clazz.setName(RandomString.make(6));
        clazz.setId(new Random().nextLong());
        clazz.setEntranceDate(new Random().nextLong());
        clazz.setStudentNumber(new Random().nextLong());
        return clazz;
    }

    @Test
    void getByIdJsonview() throws Exception {
        Clazz clazz = getOneClazz();

        Mockito.doReturn(clazz).when(this.clazzService).getById(Mockito.anyLong());


        mockMvc.perform(MockMvcRequestBuilders.get("/clazz/" + clazz.getId()))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.entranceDate").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.studentNumber").exists());

    }
    @Test
    void getAllJsonview() throws Exception {
        List<Clazz> clazzes = new ArrayList<>();
        clazzes.add(getOneClazz());
        clazzes.add(getOneClazz());

        Mockito.doReturn(clazzes).when(this.clazzService).getAll();


        mockMvc.perform(MockMvcRequestBuilders.get("/clazz/getAll"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].studentNumber").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].entranceDate").doesNotExist());

    }
    @Test
    void pageJsonview() throws Exception {
        List<Clazz> clazzes = new ArrayList<>();
        clazzes.add(getOneClazz());
        clazzes.add(getOneClazz());
        Page<Clazz> clazzPage = new PageImpl<Clazz>(clazzes);

        Mockito.doReturn(clazzPage).when(this.clazzService).page(Mockito.anyString(), Mockito.any(Pageable.class));

        mockMvc.perform(MockMvcRequestBuilders.get("/clazz/page"))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].studentNumber").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].entranceDate").exists());

    }
}