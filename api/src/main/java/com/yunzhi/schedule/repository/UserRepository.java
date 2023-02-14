package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.User;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;


public interface UserRepository extends CrudRepository<User, Long>, JpaSpecificationExecutor<User> {

    User findByPhoneAndDeletedFalse(String phone);

    /**
     * 根据用户名查询用户
     */
    Optional<User> findByPhone(String username);
}
