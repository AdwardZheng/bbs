import { Controller } from 'egg';
import * as moment from 'moment';

export default class HomeController extends Controller {
  async index() {
    const { ctx, service, config } = this;
    // const name = ctx.query.name;
    // console.log(name);
    // console.log(name ? ctx.helper.trim(name) : '');
    // ctx.body = await ctx.service.test.sayHi('egg');
    // ctx.body = await ctx.service.user.test();
    let page: number = parseInt(ctx.query.page, 10) || 1;
    page = page > 0 ? page : 1;

    const query = {
      create_date: {
        $gte: moment().subtract(1, 'years').toDate(),
      },
    };

    const limit = config.topic_count;

    const options = {
      skip: (page - 1) * limit,
      limit,
      sort: {
        top: -1,
        last_replay_at: -1,
      },
    };

    const topics = await service.topic.getTopicsByQuery(query, options);

    //  获取分页数据
    const all_topic_count = await service.topic.getCountByQuery(query);
    const pages = Math.ceil(all_topic_count / limit);
    ctx.body = {
      topics,
      pages,
    };
  }
}
