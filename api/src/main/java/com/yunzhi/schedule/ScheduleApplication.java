package com.yunzhi.schedule;

import com.yunzhi.schedule.repository.SoftDeleteRepositoryFactoryBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(value = "com.yunzhi.schedule",
		repositoryFactoryBeanClass = SoftDeleteRepositoryFactoryBean.class)
public class ScheduleApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScheduleApplication.class, args);
	}

}
