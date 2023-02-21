package club.yunzhi.schedule;

import club.yunzhi.schedule.repository.SoftDeleteRepositoryFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@ServletComponentScan
@SpringBootApplication
@EnableJpaRepositories(value = "club.yunzhi.schedule",
		repositoryFactoryBeanClass = SoftDeleteRepositoryFactoryBean.class)
public class ScheduleApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScheduleApplication.class, args);
	}

}
