import { Application } from 'egg';
import exist_user from './middleware/exist_user';

export default (app: Application) => {
  const { controller, router, middleware } = app;

  const existUser = middleware.existUser();

  router.get('/', controller.home.index);

  // user

  const localStrategy = app.passport.authenticate('local', {
    successRedirect: '/',
  });

  router.get('/signup', controller.user.signup);
  router.get('/login', localStrategy);
  router.all('/signout', controller.user.signout);
  router.post('/reset_psw', controller.user.resetPass);
  // topic

  // 新建主题帖
  router.post('/topic/create', existUser, controller.topic.create);
  // 获取主题及其回复
  router.get('/topic/:tid', controller.topic.index);
  // 修改主题
  router.post('/topic/:tid/edit', exist_user, controller.topic.update);
};
