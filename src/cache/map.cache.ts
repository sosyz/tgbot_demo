import { Init, Provide, Scope, ScopeEnum } from '@midwayjs/core';

@Provide()
@Scope(ScopeEnum.Singleton)
export default class MapCache {
  private map: Map<string, any>;

  @Init()
  async init() {
    this.map = new Map<string, any>();
  }

  set(key: string, value: any) {
    this.map.set(key, value);
  }

  get(key: string) {
    return this.map.get(key);
  }

  delete(key: string) {
    this.map.delete(key);
  }

  has(key: string) {
    return this.map.has(key);
  }

  clear() {
    this.map.clear();
  }
}
