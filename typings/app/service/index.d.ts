// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportTopic from '../../../app/service/topic';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    topic: ExportTopic;
    user: ExportUser;
  }
}
