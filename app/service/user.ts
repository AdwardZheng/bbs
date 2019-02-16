import { Service } from 'egg';
import { UserModel } from '../constants/interface/user';
import { Model, Types } from 'mongoose';
// import { Model } from 'mongoose';
// import { UserModel } from '../constants/interface/user';
export default class UserService extends Service {

  // 根据ID查找用户
  getUserById(id: Types.ObjectId | string) {
    if (!id) return null;
    const { ctx } = this;
    return (ctx.model.User as Model<UserModel>).findOne({
      _id: id,
    });
  }

  // 添加新用户
  addNewUser(name: string, password: string, email: string) {
    const { ctx } = this;
    const user = new (ctx.model.User as Model<UserModel>)();
    user.name = name;
    user.password = password;
    user.email = email;
    console.log('保存用户信息');
    return user.save();
  }

  // 根据关键字获取一组用户
  getUserByPointWord(query: any, opt?: any) {
    console.log(query);
    const { ctx } = this;
    return (ctx.model.User as Model<UserModel>).find(query, {}, opt);
  }

  // 根据用户名获取用户
  getUserByname(name: string, opt?: any) {
    const { ctx } = this;
    return (ctx.model.User as Model<UserModel>).findOne({ name }, {}, opt);
  }

  //  增加积分和发帖数
  incScoreAndReplyCount(id: Types.ObjectId, score: number, count: number) {
    const { ctx } = this;
    const query = { _id: id };
    const update = {
      $inc: {
        score,
        reply_count: count,
      },
    };
    return (ctx.model.User as Model<UserModel>).findByIdAndUpdate(query, update, { new: true });
  }

  // test

  test() {
    const { ctx } = this;
    return (ctx.model.User as Model<UserModel>).findOneAndUpdate({
      name: 'tom',
    }, {
      new: true,
    });
  }
}
