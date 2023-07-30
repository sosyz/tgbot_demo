import { Configuration, App, Config } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as ws from '@midwayjs/ws';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
// import { ReportMiddleware } from './middleware/report.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    ws,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  @Config('botConfig')
  config: {
    token: string;
    webhookUrl: string; // 替换为您的域名和端口
  };

  async onReady() {
    // add middleware
    // this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);

    // register webhook
    console.log(this.config.webhookUrl);
    if (!this.config.webhookUrl) {
      throw new Error('webhookUrl is not set');
    }
    fetch(`https://api.telegram.org/bot${this.config.token}/setWebhook`, {
      body: JSON.stringify({
        url: this.config.webhookUrl,
      }),
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  }

  async onStop() {
    fetch(`https://api.telegram.org/bot${this.config.token}/deleteWebhook`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        drop_pending_updates: false,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  }
}
