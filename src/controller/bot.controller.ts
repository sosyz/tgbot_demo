import { Inject, Controller, Get, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { TransationService } from '../service/transaction.service';
import { TGWenHook } from '../interface';
import { TelegramService } from '../service/telegram.service';
import MapCache from '../cache/map.cache';

@Controller('/')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  transaction: TransationService;

  @Inject()
  mapCache: MapCache;

  @Inject()
  tg: TelegramService;

  @Get('/')
  async ping() {
    return { success: true, message: 'OK', data: 'pong' };
  }

  @Post('/transaction')
  async postPing(@Body() msg: TGWenHook) {
    switch (msg.message.text) {
      case '/start':
        return { success: true, message: 'OK', data: '欢迎使用' };
      case '/help':
        this.tg.sendMessage(msg.message.chat.id, '帮助');
        return { success: true, message: 'OK', data: '帮助' };
      case '/zh':
        this.mapCache.set(msg.message.chat.id.toString(), 'auto2zh');
        this.tg.sendMessage(msg.message.chat.id, '请输入要翻译的英文或日文');
        return { success: true, message: 'OK' };
      case '/en':
        this.mapCache.set(msg.message.chat.id.toString(), 'auto2en');
        this.tg.sendMessage(
          msg.message.chat.id,
          'Please input the Chinese or Japanese you want to translate'
        );
        return { success: true, message: 'OK' };
      default:
        if (this.mapCache.has(msg.message.chat.id.toString())) {
          const type = this.mapCache.get(msg.message.chat.id.toString());
          const transaction_content = await this.transaction.getAnswer(
            msg.message.text,
            type
          );
          this.tg.sendMessage(msg.message.chat.id, transaction_content);
        } else {
          this.tg.sendMessage(msg.message.chat.id, '请使用命令先选择翻译模式');
        }
        return { success: true, message: 'OK' };
    }
    // return { success: true, message: 'OK', data: await this.transaction.getAnswer(msg.message.text) };
  }
}
