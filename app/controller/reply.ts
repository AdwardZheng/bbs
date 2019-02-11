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
}
