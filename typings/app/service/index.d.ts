// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportReply from '../../../app/service/reply';
import ExportTest from '../../../app/service/Test';
import ExportTopic from '../../../app/service/topic';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    reply: ExportReply;
    test: ExportTest;
    topic: ExportTopic;
    user: ExportUser;
  }
}
