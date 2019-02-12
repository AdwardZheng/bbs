import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1548520176098_1231';

  // add your egg config in here
  config.middleware = [ 'errorHandler' ];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    topic_count: 10,
  };

  // mongoose
  config.mongoose = {
    url: 'mongodb://localhost/bbs',
  };

  // security
  config.security = {
    csrf: false,
  };

  // passport
  config.passportLocal = {
    usernameField: 'name',
    passwordField: 'password',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
