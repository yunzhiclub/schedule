package com.yunzhi.schedule.service;


import com.yunzhi.schedule.entity.WeChatUser;

public interface WechatService {

  WeChatUser getOneByOpenidAndAppId(String openId, String toUser);

}
