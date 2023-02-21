package club.yunzhi.schedule.service;


import club.yunzhi.schedule.entity.WeChatUser;

public interface WechatService {

  WeChatUser getOneByOpenidAndAppId(String openId, String toUser);

}
