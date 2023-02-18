package com.yunzhi.schedule.controller;


import com.yunzhi.schedule.Config;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@WithMockUser(username = Config.USERNAME, password = Config.PASSWORD)
public abstract class ControllerTest {

}
