// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportReply from '../../../app/controller/reply';
import ExportTopic from '../../../app/controller/topic';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    reply: ExportReply;
    topic: ExportTopic;
    user: ExportUser;
  }
}
