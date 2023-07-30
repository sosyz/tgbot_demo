import { Provide, Config, Init, Inject } from "@midwayjs/core";
import { AIBase } from "../transaction/base.transaction";
// import { Claude } from "../ai/claude.ai";
// import { ChatGPT } from "../transaction/chatgpt.ai";
import { Cyxy } from "../transaction/cyxy.transaction";

@Provide()
export class TransationService {
    @Config('transaction')
    config: { type: string, claude: { sessionKey: string }, gpt: { key: string } };

    // @Inject()
    // claude: Claude;

    // @Inject()
    // gpt: ChatGPT;

    @Inject()
    cyxy: Cyxy

    ai: AIBase;

    @Init()
    async init() {
        console.log(this.config.type)
        switch (this.config.type) {
            case 'cyxy':
                this.ai = this.cyxy;
                break
            default:
                throw new Error('not support ai type');
        }
    }

    async getAnswer(question: string, target?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.ai.translate(question, target).then((res: any) => {
                resolve(res);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}
