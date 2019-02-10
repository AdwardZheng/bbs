// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportReply from '../../../app/model/reply';
import ExportTopic from '../../../app/model/topic';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Reply: ReturnType<typeof ExportReply>;
    Topic: ReturnType<typeof ExportTopic>;
    User: ReturnType<typeof ExportUser>;
  }
}
