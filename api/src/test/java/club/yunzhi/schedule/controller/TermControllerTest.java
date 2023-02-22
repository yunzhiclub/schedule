package club.yunzhi.schedule.controller;

import club.yunzhi.schedule.entity.Term;
import club.yunzhi.schedule.service.TermService;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Random;

class TermControllerTest extends ControllerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    TermService termService;


    public Term getOneTerm() {
        Term term = new Term();
        term.setName(RandomString.make(6));
        term.setId(new Random().nextLong());
        term.setState(new Random().nextBoolean());
        term.setStartTime(new Random().nextLong());
        term.setEndTime(new Random().nextLong());
        return term;
    }


}