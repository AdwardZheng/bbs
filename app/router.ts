import { Application } from 'egg';
export default (app: Application) => {
  const { controller, router, middleware, config } = app;

  const existUser = middleware.existUser();
  const requieAdmin = middleware.requireAdmin();
  const createUsreLimit = middleware.createUserLimit(config.createUserLimit.limit);
  const createTopicLimit = middleware.createTopicLimit(config.createTopicLimit.limit);

  router.get('/api/home', controller.home.index);

  // user

  const localStrategy = app.passport.authenticate('local', {
    // successRedirect: '/',
  });

  router.post('/api/signup', createUsreLimit, controller.user.signup);
  router.post('/api/login', localStrategy);
  router.all('/api/signout', controller.user.signout);
  router.post('/api/reset_psw', controller.user.resetPass);
  router.get('/api/user/:name', controller.user.index);
  router.get('/api/user', existUser, controller.user.getUser);

  // topic

  // 新建主题帖
  router.post('/api/topic/create', existUser, createTopicLimit, controller.topic.create);
  // 获取主题及其回复
  router.get('/api/topic/:tid', controller.topic.index);
  // 修改主题
  router.post('/api/topic/:tid/edit', existUser, controller.topic.update);
  // 将某个话题置顶
  router.post('/api/topic/:tid/top', requieAdmin, controller.topic.top);
  // 将某个话题加精
  router.post('/api/topic/:tid/good', requieAdmin, controller.topic.good);

  // reply

  // 提交回复
  router.post('/api/:tid/reply', existUser, controller.reply.add);
  // 修改评论
  router.post('/api/reply/:reply_id/edit', existUser, controller.reply.update);
  // 点赞
  router.post('/api/reply/:reply_id/likes', existUser, controller.reply.likes);
};
