import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1690611601885_6888',
  koa: {
    port: 7001,
  },
  botConfig: {
    token: process.env.botToken,
    webhookUrl: `${process.env.host}/transaction`, // 替换为您的域名和端口
  },
  transaction: {
    type: 'cyxy',
    claude: {
      sessionKey: process.env.claudeSessionKey
    },
    gpt: {
      key: process.env.gptKey
    },
    volcengine: {
      ak: process.env.volcengineAk,
      sk: process.env.volcengineSk
    },
    cyxy: {
      key: process.env.cyxyKey
    }
  }
} as MidwayConfig;