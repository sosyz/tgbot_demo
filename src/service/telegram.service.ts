import { Provide, Config } from '@midwayjs/core';

@Provide()
export class TelegramService {
  @Config('botConfig')
  config: {
    token: string;
    webhookUrl: string; // 替换为您的域名和端口
  };

  async sendMessage(chatId: number, message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fetch(`https://api.telegram.org/bot${this.config.token}/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then(res => res.json())
        .then(res => {
          resolve(res.ok);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
