/**
 * 判断用户是否是管理员
 */
export default () => {
  return async function requireAdmin(ctx: any, next: () => Promise<any>) {
    if (!ctx.user || !ctx.user._id) {
      ctx.status = 403;
      ctx.body = '用户不存在或尚未登录';
      return;
    }

    if (!ctx.app.config.admings.includes(ctx.user.name)) {
      ctx.status = 403;
      ctx.body = '该用户不是管理员';
      return;
    }
    await next();
  };
};
