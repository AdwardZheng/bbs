import { Controller } from 'egg';

export default class ReplyController extends Controller {

  //  添加回复
  async add() {
    const { ctx, service } = this;
    const content = ctx.request.body.content;

    if (!content) {
      ctx.body = {
        err: '参数不存在',
      };
      return;
    }

    if (ctx.helper.trim(content) === '') {
      ctx.status = 422;
      ctx.body = {
        err: '回复内容不能为空',
      };
      return;
    }

    const topic_id = ctx.params.tid;
    const topic = await service.topic.getTopicById(topic_id);
    if (!topic) {
      ctx.status = 404;
      ctx.body = {
        err: '主题不存在',
      };
      return;
    }

    const user_id = ctx.user._id;
    const reply = await service.reply.newAndSave(content, topic._id, user_id);

    // await service.user.incScoreAndReplyCount(user_id, 5, 1);
    // await service.topic.updateLasetReply(topic_id, reply._id);

    // TopicModel和UserModel的类型不一致所以需要转为any
    await Promise.all([
      service.user.incScoreAndReplyCount(user_id, 5, 1) as any,
      service.topic.updateLasetReply(topic_id, reply._id),
    ]);

    ctx.body = {
      msg: '回复成功',
    };
  }

  // 修改评论
  async update() {
    const { ctx, service } = this;
    const reply_id = ctx.reply_id;
    const content = ctx.request.body.content;
    const reply = await service.reply.getReplyById(reply_id);

    if (!reply) {
      ctx.status = 404;
      ctx.body = {
        err: '此回复不存在或被删除',
      };
      return;
    }

    if (ctx.user._id.toString() === reply.author_id) {
      if (ctx.helper.trim(content) !== '') {
        reply.content = content;
        reply.update_at = new Date();
        await reply.save();
        ctx.body = {
          msg: '修改回复成功',
        };
        return;
      }

      ctx.body = {
        err: '回复字数太少',
      };
      return;
    }

    ctx.status = 403;
    ctx.body = {
      err: '你不能编辑此回复',
    };
    return;
  }

  // 点赞
  async likes() {
    const { ctx, service } = this;
    const reply_id = ctx.reply_id;
    const user_id = ctx.user_id;
    const reply = await service.reply.getReplyById(reply_id);

    if (!reply) {
      ctx.status = 404;
      ctx.body = {
        err: '此回复不存在或被删除',
      };
      return;
    }

    const likes_Index = reply.likes.indexOf(user_id);
    let msg: string;
    if (likes_Index === -1) {
      reply.likes.push(user_id);
      msg = 'up';
    } else {
      reply.likes.splice(likes_Index);
      msg = 'down';
    }

    await reply.save();
    ctx.body = {
      msg,
    };
  }
}
