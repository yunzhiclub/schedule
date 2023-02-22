package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.entity.User;
import club.yunzhi.schedule.entity.WeChatUser;
import club.yunzhi.schedule.service.UserService;
import net.bytebuddy.utility.RandomString;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Random;


class UserControllerTest extends ControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    UserService userService;


    public User getOneUser() {
        User user = new User();
        user.setName(RandomString.make(6));
        user.setWeChatUser(new WeChatUser());
        user.setPassword(RandomString.make(6));
        user.setPhone(new Random(11).toString());
        user.setId(new Random().nextLong());
        return user;
    }

    @Test
    void getById() throws Exception {
        User user = getOneUser();

        Mockito.doReturn(user).when(this.userService).findById(Mockito.anyLong());

        mockMvc.perform(MockMvcRequestBuilders.get("/user/" + user.getId()))
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.phone").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.weChatUser").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.password").doesNotExist());
    }
}