/**
 * 限制每个ip每天注册数
 */
import * as moment from 'moment';
export default (limit: number) => {
  return async function createUserLimir(ctx: any, next: () => Promise<any>) {
    const { service } = ctx;
    const ip = ctx.ip;
    const time = moment().format('YYYYMMDD');
    const key = `user_count_${ip}_${time}`;
    const count = (await service.cache.get(key)) || 0;
    if (count >= limit) {
      ctx.status = 403;
      ctx.body = {
        err: `每天仅可操作${limit}次`,
      };
      return;
    }

    await next();
  };
};
