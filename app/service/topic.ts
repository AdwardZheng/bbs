import { Service } from 'egg';
import { Model, Types } from 'mongoose';
import { TopicModel } from '../constants/interface/topic';
export default class TopicService extends Service {

  //  添加新主题
  addNewTopic(title: string, content: string, author_id: Types.ObjectId) {
    const { ctx } = this;
    const topic = new (ctx.model.Topic as Model<TopicModel>)();
    topic.title = title;
    topic.content = content;
    topic.author_id = author_id;
    return topic.save();
  }

  //  获取主题及回复
  async getFullTopic(id: string) {
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
    return ctx.model.Topic.findByIdAndUpdate(query, update, { new: true });
  }

  getTopicById(id: string) {
    const { ctx } = this;
    return (ctx.model.Topic as Model<TopicModel>).findOne({ _id: id });
  }

  //  更新最后回复
  updateLasetReply(topic_id: Types.ObjectId, reply_id: Types.ObjectId) {
    const { ctx } = this;
    const update = {
      last_reply: reply_id,
      last_reply_at: new Date(),
      $inc: {
        reply_count: 1,
      },
    };

    const opts = { new: true };
    return (ctx.model.Topic as Model<TopicModel>).findByIdAndUpdate(topic_id, update, opts);
  }

  //  自定义搜索
  async getTopicsByQuery(query: any, opts?: object) {
    const { ctx } = this;
    return await (ctx.model.Topic as Model<TopicModel>).find(query, {}, opts).populate('author_id');
  }

  //  获取主题数
  getCountByQuery(query: any) {
    const { ctx } = this;
    return ctx.model.Topic.countDocuments(query);
  }
}
