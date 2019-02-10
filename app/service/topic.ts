import { Service } from 'egg';
import { Model, Types } from 'mongoose';
import { TopicModel } from '../constants/interface/topic';
export default class TopicService extends Service {

  //  添加新主题
  addNewTopic(title: string, content: string, author_id: string) {
    const { ctx } = this;
    const topic = new (ctx.model.Topic as Model<TopicModel>)();
    topic.title = title;
    topic.content = content;
    topic.author_id = author_id;
    return topic.save();
  }

  //  获取主题
  async getTopic(id: string) {
    const { ctx, service } = this;
    const query = { _id: id };
    const topic = await (ctx.model.Topic as Model<TopicModel>).findOne(query);
    if (!topic) {
      return null;
    }

    const author = await service.user.getUserById(topic.author_id);
    if (!author) {
      // 作者不存在
      return null;
    }

    // TODO回复
    const replies = await service.reply.getRepliesByTopicId(topic._id);

    return {
      topic,
      author,
      replies,
    };
  }

  incVisitCount(id: Types.ObjectId) {
    const { ctx } = this;
    const query = { _id: id };
    const update = { $inc: { visitCount: 1 } };
    return ctx.model.Topic.findByIdAndUpdate(query, update);
  }
}
