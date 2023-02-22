package club.yunzhi.schedule.wxhandler;
import club.yunzhi.schedule.entity.WeChatUser;
import club.yunzhi.schedule.service.WeChatMpService;
import club.yunzhi.schedule.service.WechatService;
import club.yunzhi.schedule.wxmessagebuilder.TextBuilder;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 处理关注事件
 * 新用户走关注事件；老用户走扫码事件
 * @author Binary Wang
 */
@Component
public class SubscribeHandler extends AbstractHandler {
  private final WeChatMpService weChatMpService;
  private final WechatService wechatService;
  private final Logger logger = LoggerFactory.getLogger(this.getClass());

  public SubscribeHandler(WeChatMpService weChatMpService , WechatService wechatService) {
    super(weChatMpService);
    this.weChatMpService = weChatMpService;
    this.wechatService = wechatService;
  }

  @Override
  public WxMpXmlOutMessage handle(WxMpXmlMessage wxMessage,
                                  Map<String, Object> context,
                                  WxMpService wxMpService,
                                  WxSessionManager sessionManager) throws WxErrorException {
    if (this.logger.isDebugEnabled()) {
      this.logger.info("新关注用户 OPENID: " + wxMessage.getFromUser());
    }
    WeChatUser weChatUser = this.wechatService.getOneByOpenidAndAppId(wxMessage.getFromUser(), wxMessage.getToUser());
    if (wxMessage.getEventKey().startsWith("qrscene_")) {
      String key = wxMessage.getEventKey().substring("qrscene_".length());
      return this.handleByEventKey(key, weChatUser, wxMessage);
    }
    return new TextBuilder().build("感谢关注，祝您生活愉快!",
        wxMessage,
        weChatMpService);
  }
}
