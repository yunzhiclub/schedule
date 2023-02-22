package club.yunzhi.schedule;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class ScheduleApplicationTests {

	@Test
	void contextLoads() {
		String password = "yunzhi";
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String encodedPassword = encoder.encode(password);
		System.out.println(encodedPassword);
	}

}
