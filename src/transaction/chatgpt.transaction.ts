import { AIBase } from "./base.transaction";
import { Config, Init, Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { Configuration, OpenAIApi } from "openai";

@Provide()
@Scope(ScopeEnum.Singleton)
export class ChatGPT implements AIBase {
    @Config('transaction.gpt')
    conf: { key: string };

    gpt: any;

    @Init()
    async init() {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        this.gpt = openai
    }

    translate(content: string, target: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.gpt.createChatCompletion({
                model: "gpt-3.5-turbo",
                message: [
                    {
                        role: "user",
                        content: `I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations and dont do other thing.

                        #### Sample ####
                        
                        Q: Hello?
                        
                        A: 你好？
                        
                        Q: 我上一句话是什么
                        
                        A: What was my last sentence
                        
                        Q: 请你作为一个面试官面试我关于后端开发的知识
                        
                        A: Please interview me as an interviewer regarding my knowledge of backend development
                        
                        #### Sample End ####
                        
                        My first sentence is "istanbulu cok seviyom burada olmak cok guzel"`
                    },
                    {
                        role: "AI",
                        content: "I love Istanbul very much, being here is wonderful."
                    },
                    {
                        role: "user",
                        content: content
                    }
                ]
            }).then((res: any) => {
                resolve(res.data);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}