import { Controller } from 'egg';
import * as moment from 'moment';
export default class UserController extends Controller {

  async index() {
    const { ctx, service } = this;
    const user_name = ctx.params.name;
    const user = await service.user.getUserByname(user_name);

    if (!user) {
      ctx.status = 404;
      ctx.body = {
        msg: '此用户不存在',
      };
      return;
    }

    // 查找创建的话题
    const query = {
      author_id: user._id,
    };
    const opt = {
      limit: 5,
      sort: {
        create_at: -1,
      },
    };

    const [ recent_topics, replies ] = await Promise.all([
      service.topic.getTopicsByQuery(query, opt),
      service.reply.getReplyByAuthorId(user._id, { limit: 20, sort: { create_at: -1 } }),
    ]);

    // 通过构造set去重
    const topic_ids = [ ...new Set(replies.map(reply => reply.topic_id.toString())) ].slice(0, 5);

    const recent_replies_topic_query = {
      id: {
        $in: topic_ids,
      },
    };

    let recent_replies = await service.topic.getTopicsByQuery(recent_replies_topic_query);
    // 根据回复时间排序
    recent_replies = recent_replies.sort((a, b) => {
      return topic_ids.indexOf(a._id) - topic_ids.indexOf(b._id);
    });

    ctx.body = {
      user,
      recent_replies,
      recent_topics,
    };
  }

  // 注册
  async signup() {
    const { ctx, service } = this;
    const paramas = ctx.request.body;
    const { name, email, password } = paramas;

    //  检查参数
    const createRule = {
      name: { type: 'string', required: true, trim: true },
      email: { type: 'email', required: true, trim: true },
      password: { type: 'string', required: true, trim: true },
    };

    ctx.validate(createRule, paramas);
    const user = await service.user.getUserByPointWord({
      $or: [
        { name },
        { email },
      ],
    }, {});
    if (user.length > 0) return ctx.body = { err: '用户已存在' };
    // await service.user.addNewUser(name, password, email);
    const ip = ctx.ip;
    const time = moment().format('YYYYMMDD');
    const cacheKey = `user_count_${ip}_${time}`;
    await Promise.all([
      service.user.addNewUser(name, password, email),
      service.cache.incr(cacheKey, 60 * 60 * 24),
    ]);

    ctx.body = JSON.stringify(paramas);
  }

  //  登陆
  async login() {
    const { ctx, service } = this;
    const { name, password } = ctx.query;
    const user = await service.user.getUserByname(name);
    if (!user) return null;
    if (user.password === password) {
      ctx.body = user.toJSON();
    } else {
      ctx.body = '密码或用户名错误';
    }
  }

  //  登出
  async signout() {
    const { ctx } = this;
    ctx.sesstion = null;
    ctx.logout();
    ctx.redirect('/');
  }

  // 重置密码
  async resetPass() {
    const { ctx, service } = this;
    const { psw, repsw, name } = ctx.request.body;
    const createRule = {
      psw: { type: 'string', required: true, trim: true },
      repsw: { type: 'string', required: true, trim: true },
      name: { type: 'string', required: true, trim: true },
    };
    ctx.validate(createRule, ctx.request.body);
    if (psw !== repsw) {
      ctx.body = {
        err: '两次输入密码不一致',
      };
    }

    const user = await service.user.getUserByname(name);
    if (!user) {
      ctx.body = {
        err: '用户不存在',
      };
      return;
    }

    user.password = psw;
    await user.save();
    ctx.body = {
      msg: '重置密码成功',
    };
  }

  // 获取登录用户信息
  async getUser() {
    const { ctx } = this;
    const { loginname, score, create_at, name } = ctx.user;
    ctx.body = {
      user: {
        loginname,
        name,
        score,
        create_at,
      },
    };
  }
}
