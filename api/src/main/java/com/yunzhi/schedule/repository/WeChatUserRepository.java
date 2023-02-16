package com.yunzhi.schedule.repository;

import com.yunzhi.schedule.entity.WeChatUser;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

/**
 * 微信(公众号)用户
 */
public interface WeChatUserRepository extends CrudRepository<WeChatUser, Long> {

  Optional<WeChatUser> findByOpenid(String openid);

  Optional<WeChatUser> findByOpenidAndAppId(String openid, String appId);
}
