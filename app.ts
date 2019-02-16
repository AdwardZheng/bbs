import { Application, Context } from 'egg';
import { CookieSetOptions } from 'egg-cookies';

export default (app: Application) => {
  const getUser = async (ctx: Context, name: string, password: string) => {
    const user = await ctx.service.user.getUserByname(name);
    if (!user) return null;
    if (user.password === password) {
      return user;
    } else {
      // 密码或用户名错误
      return null;
    }
  };

  app.passport.verify(async (ctx: Context, user: any) => {
    console.log('鉴权');
    const existUser = await getUser(ctx, user.username, user.password);
    if (existUser) {
      const auth_token: string = existUser._id;
      const opts: CookieSetOptions = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30, //  过期时间一个月
        signed: true,
        httpOnly: true,
      };
      ctx.cookies.set('bbs', auth_token, opts);
    }

    return existUser;
  });

  app.passport.deserializeUser(async (ctx: Context, userField: any) => {
    console.log('获取user');
    let user;
    if (userField) {
      const auth_token = ctx.cookies.get('bbs', { signed: true });
      if (!auth_token) return null;

      const user_id = auth_token;
      user = await ctx.service.user.getUserById(user_id);

      if (!user) return null;

      return user;
    }

    return user;
  });
};
