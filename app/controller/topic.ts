import { Controller } from 'egg';

export default class TopicController extends Controller {

  async index() {
    const { ctx, service } = this;
    const topic_id: string = ctx.params.tid;
    if (topic_id.length !== 24) {
      ctx.status = 404;
      ctx.message = '此话题不存在或已被删除';
      return;
    }

    const result = await service.topic.getFullTopic(topic_id);
    if (!result) {
      ctx.status = 404;
      ctx.message = '此话题不存在或已被删除';
      return;
    }

    const { topic, author, replies } = result;
    // 增加点击量
    await service.topic.incVisitCount(topic._id);

    const topicObj = topic.toObject();
    const authorObj = author.toObject();
    ctx.body = {
      data: {
        topic: topicObj,
        author: authorObj,
        replies,
      },
    };
  }

  //  发新帖
  async create() {
    console.log('create topic');
    const { ctx, service } = this;

    // 检查参数
    const createRule = {
      title: {
        type: 'string',
        trim: true,
        max: 100,
        min: 5,
      },
      content: {
        type: 'string',
      },
    };
    ctx.validate(createRule, ctx.request.body);

    //  保存新帖
    const body = ctx.request.body;
    const topic = await service.topic.addNewTopic(
      body.title,
      body.content,
      ctx.user._id,
    );

    await service.user.incScoreAndReplyCount(topic.author_id, 5, 1);

    ctx.body = {
      msg: '发布成功',
    };
  }

  //  更新主题帖
  async update() {
    const { ctx, service } = this;
    const topic_id = ctx.params.tid;
    let { title, content } = ctx.request.body;

    const topic = await service.topic.getTopicById(topic_id);
    if (!topic) {
      ctx.status = 404;
      ctx.body = {
        err: '此话题不存在',
      };
      return;
    }

    if (topic.author_id.toString() === ctx.user._id.toString()) {
      title = ctx.helper.trim(title);
      content = ctx.helper.trim(content);

      let errMsg;
      //  验证错误
      if (title === '') {
        errMsg = '标题不能为空';
      } else if (title.length < 5 || title.length > 50) {
        errMsg = '标题太长或太短';
      } else if (content === '') {
        errMsg = '内容不能为空';
      }

      if (errMsg) {
        ctx.body = {
          err: errMsg,
        };
        return;
      }

      // 保存
      topic.title = title;
      topic.content = content;
      topic.update_date = new Date();

      await topic.save();

      ctx.body = {
        msg: '更新成功',
      };
    } else {
      ctx.status = 403;
      ctx.body = {
        err: '你不能编辑此主题',
      };
    }
  }

  // 置顶
  async top() {
    const { ctx, service } = this;
    const topic_id = ctx.params.tid;

    const topic = await service.topic.getTopicById(topic_id);

    if (!topic) {
      ctx.status = 404;
      ctx.body = {
        err: '此话题不存在',
      };
      return;
    }

    topic.top = !topic.top;

    await topic.save();
    const msg = topic.top ? '已置顶' : '置顶已取消';

    ctx.body = {
      msg,
    };
  }

  // 加精
  async good() {
    const { ctx, service } = this;
    const topic_id = ctx.params.tid;

    const topic = await service.topic.getTopicById(topic_id);

    if (!topic) {
      ctx.status = 404;
      ctx.body = {
        err: '此话题不存在',
      };
      return;
    }

    topic.good = !topic.good;
    await topic.save();
    const msg = topic.good ? '已将此话题设为精华' : '此话题已取消精华';
    ctx.body = {
      msg,
    };
  }

}
