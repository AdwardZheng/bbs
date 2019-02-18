import { Application } from 'egg';
export default (app: Application) => {
  const { controller, router, middleware, config } = app;

  const existUser = middleware.existUser();
  const requieAdmin = middleware.requireAdmin();
  const createUsreLimit = middleware.createUserLimit(config.createUserLimit.limit);
  const createTopicLimit = middleware.createTopicLimit(config.createTopicLimit.limit);

  router.get('/home', controller.home.index);
  router.get('/', controller.home.view);

  // user

  const localStrategy = app.passport.authenticate('local', {
    successRedirect: '/',
  });

  router.post('/signup', createUsreLimit, controller.user.signup);
  router.post('/login', localStrategy);
  router.all('/signout', controller.user.signout);
  router.post('/reset_psw', controller.user.resetPass);
  router.get('/user/:name', controller.user.index);
  router.get('/user', existUser, controller.user.getUser);

  // topic

  // 新建主题帖
  router.post('/topic/create', existUser, createTopicLimit, controller.topic.create);
  // 获取主题及其回复
  router.get('/topic/:tid', controller.topic.index);
  // 修改主题
  router.post('/topic/:tid/edit', existUser, controller.topic.update);
  // 将某个话题置顶
  router.post('/topic/:tid/top', requieAdmin, controller.topic.top);
  // 将某个话题加精
  router.post('/topic/:tid/good', requieAdmin, controller.topic.good);

  // reply

  // 提交回复
  router.post('/:tid/reply', existUser, controller.reply.add);
  // 修改评论
  router.post('/reply/:reply_id/edit', existUser, controller.reply.update);
  // 点赞
  router.post('/reply/:reply_id/likes', existUser, controller.reply.likes);
};
