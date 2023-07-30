import { AIBase } from './base.transaction';
import { Config, Provide, Scope, ScopeEnum } from '@midwayjs/core';

@Provide()
@Scope(ScopeEnum.Singleton)
export class Cyxy implements AIBase {
  @Config('transaction.cyxy')
  cyxy: { key: string };

  translate(content: string, target: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (target === undefined) {
        target = 'en';
      }
      fetch('http://api.interpreter.caiyunai.com/v1/translator', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'x-authorization': 'token ' + this.cyxy.key,
        }),
        body: JSON.stringify({
          source: [content],
          trans_type: target,
          request_id: 'demo',
          detect: true,
        }),
      })
        .then(res => res.json())
        .then(res => {
          resolve(res.target[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
