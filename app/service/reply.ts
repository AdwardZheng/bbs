import { Service } from 'egg';
import { Model, Types } from 'mongoose';
import { ReplyModel } from '../constants/interface/reply';
export default class ReplyService extends Service {

  // 根据topicId获取回复
  async getRepliesByTopicId(id: Types.ObjectId) {
    const { ctx } = this;
    const query = {
      topic_id: id,
    };
    const replies = await (ctx.model.Reply as Model<ReplyModel>).find(query).sort({
      create_at: 1,
    });

    if (replies.length === 0) {
      return [];
    }

    return Promise.all(
      replies.map(async item => {
        const author = await this.service.user.getUserById(item.author_id);
        return {
          ...item.toObject(),
          author: author ? author.toObject() : { _id: '' },
        };
      }),
    );
  }

  //  新建回复
  async newAndSave(content: string, topic_id: Types.ObjectId, author_id: Types.ObjectId) {
    const { ctx } = this;
    const reply = new (ctx.model.Reply as Model<ReplyModel>)();
    reply.content = content;
    reply.topic_id = topic_id;
    reply.author_id = author_id;

    await reply.save();

    return reply;
  }

  async getReplyById(id: Types.ObjectId | string) {
    const { ctx } = this;
    return (ctx.model.Reply as Model<ReplyModel>).findById(id);
  }
}
