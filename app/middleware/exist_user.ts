/**
 * 判断是否存在用户即登录
 */
// import { Context, Application } from 'egg';
export default () => {
  return async function existUser(ctx: any, next: () => Promise<any>) {
    if (!ctx.user || !ctx.user._id) {
      ctx.status = 403;
      ctx.body = '用户不存在或尚未登录';
      return;
    }
    await next();
  };
};
