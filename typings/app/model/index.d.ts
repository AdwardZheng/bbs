// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTopic from '../../../app/model/topic';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Topic: ReturnType<typeof ExportTopic>;
    User: ReturnType<typeof ExportUser>;
  }
}
