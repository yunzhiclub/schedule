package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.User;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;


public interface UserRepository extends CrudRepository<User, Long>, JpaSpecificationExecutor<User> {

    User findByPhoneAndDeletedFalse(String phone);
}
