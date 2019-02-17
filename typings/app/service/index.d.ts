// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCache from '../../../app/service/cache';
import ExportReply from '../../../app/service/reply';
import ExportTest from '../../../app/service/Test';
import ExportTopic from '../../../app/service/topic';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    cache: ExportCache;
    reply: ExportReply;
    test: ExportTest;
    topic: ExportTopic;
    user: ExportUser;
  }
}
