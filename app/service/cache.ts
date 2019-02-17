import { Service } from 'egg';

export default class CacheService extends Service {
  async get(key: string) {
    const { redis, logger } = this.app;
    const time = Date.now();
    let data = await redis.get(key);
    if (!data) return;
    data = JSON.parse(data);
    const duration = (Date.now() - time);
    logger.debug('Cache', 'set', key, (duration + 'ms'));
    return data;
  }

  async setex(key: string, value: any, seconds: number) {
    const { redis, logger } = this.app;
    const time = Date.now();
    value = JSON.stringify(value);
    await redis.set(key, value, 'EX', seconds);
    const duration = (Date.now() - time);
    logger.debug('Cache', 'set', key, (duration + 'ms'));
  }

  async incr(key: string, seconds: number) {
    const { redis, logger } = this.app;
    const time = Date.now();
    const result = await redis.multi().incr(key).expire(key, seconds).exec();
    const duration = (Date.now() - time);
    logger.debug('Cache', 'set', key, (duration + 'ms'));
    return result[0][1];
  }
}
