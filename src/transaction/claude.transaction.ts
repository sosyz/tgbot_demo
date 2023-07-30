import { AIBase } from './base.transaction';
import { Config, Init, Provide, Scope, ScopeEnum } from '@midwayjs/core';
// import { Claude as ClaudeLib } from "claude-ai"

@Provide()
@Scope(ScopeEnum.Singleton)
export class Claude implements AIBase {
  @Config('transaction.claude')
  conf: { sessionKey: string };

  claude: any;

  on: boolean;

  @Init()
  async init() {
    if (this.conf.sessionKey !== '') {
      this.on = true;
    } else {
      this.on = false;
      return;
    }
    const ClaudeLib = (await import('claude-ai/index.js')).Claude;
    const claude = new ClaudeLib({ sessionKey: this.conf.sessionKey });
    if (!claude.ready) {
      await claude.init();
    }
    this.claude = claude;
  }

  translate(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.claude
        .startConversation(
          `I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations and dont do other thing.

            #### Sample ####

            Q: Hello?

            A: 你好？

            Q: 我上一句话是什么

            A: What was my last sentence

            Q: 请你作为一个面试官面试我关于后端开发的知识

            A: Please interview me as an interviewer regarding my knowledge of backend development

            #### Sample End ####

            My first sentence is "istanbulu cok seviyom burada olmak cok guzel"`
        )
        .then((conversation: any) => {
          conversation
            .sendMessage(content)
            .then((res: any) => {
              resolve(res.completion);
            })
            .catch((err: any) => {
              reject(err);
            });
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
