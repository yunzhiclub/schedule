package club.yunzhi.schedule.wxhandler;


import club.yunzhi.schedule.entity.WeChatUser;
import club.yunzhi.schedule.service.WeChatMpEventKeyHandler;
import club.yunzhi.schedule.service.WeChatMpService;
import club.yunzhi.schedule.wxmessagebuilder.TextBuilder;
import me.chanjar.weixin.mp.api.WxMpMessageHandler;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Binary Wang
 */
public abstract class AbstractHandler implements WxMpMessageHandler {
  protected WeChatMpService weChatMpService;
  private Logger logger = LoggerFactory.getLogger(this.getClass());

  public AbstractHandler(WeChatMpService weChatMpService) {
    this.weChatMpService = weChatMpService;
  }

  protected WxMpXmlOutMessage handleByEventKey(String eventKey, WeChatUser weChatUser, WxMpXmlMessage wxMpXmlMessage) {
    WeChatMpEventKeyHandler weChatMpEventKeyHandler = this.weChatMpService.getHandler(eventKey);
    if (weChatMpEventKeyHandler == null) {
      return new TextBuilder().build("该二维码已过期或发生了其它错误，请重试",
          wxMpXmlMessage,
          weChatMpService);
    }
    this.weChatMpService.removeHandler(wxMpXmlMessage.getEventKey());
    return weChatMpEventKeyHandler.handle(wxMpXmlMessage, weChatUser);
  }
}
