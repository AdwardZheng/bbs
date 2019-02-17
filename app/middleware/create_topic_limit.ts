/**
 * 每日限制发帖数量
 */
import * as moment from 'moment';
export default (limit: number) => {
  return async function createTopicLimit (ctx: any, next: () => Promise<any>) {
    const { user, service } = ctx;
    const time = moment().format('YYYYMMDD');
    const key = `topic_count_${user._id}_${time}`;
    const todayTopicCount = (await service.cache.get(key)) || 0;
    if (todayTopicCount >= limit) {
      ctx.status = 403;
      ctx.body = {
        err: `今日发帖量已达到${limit}次限制`,
      };
      return;
    }

    await next();
  };
};
