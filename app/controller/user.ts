import { Controller } from 'egg';
export default class UserController extends Controller {
  // 注册
  async signup() {
    const { ctx, service } = this;
    const paramas = ctx.query;
    const { name, email, password } = paramas;

    //  检查参数
    const createRule = {
      name: { type: 'string', required: true, trim: true },
      email: { type: 'string', required: true, trim: true },
      password: { type: 'string', required: true, trim: true },
    };

    ctx.validate(createRule, paramas);
    const user = await service.user.getUserByPointWord({
      $or: [
        { name },
        { email },
      ],
    }, {});
    if (user.length > 0) return ctx.body = '用户已存在';

    await service.user.addNewUser(name, password, email);
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
}
