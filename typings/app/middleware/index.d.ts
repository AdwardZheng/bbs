// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCreateTopicLimit from '../../../app/middleware/create_topic_limit';
import ExportCreateUserLimit from '../../../app/middleware/create_user_limit';
import ExportErrorHandler from '../../../app/middleware/error_handler';
import ExportExistUser from '../../../app/middleware/exist_user';
import ExportRequireAdmin from '../../../app/middleware/require_admin';

declare module 'egg' {
  interface IMiddleware {
    createTopicLimit: typeof ExportCreateTopicLimit;
    createUserLimit: typeof ExportCreateUserLimit;
    errorHandler: typeof ExportErrorHandler;
    existUser: typeof ExportExistUser;
    requireAdmin: typeof ExportRequireAdmin;
  }
}
