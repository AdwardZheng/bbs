import { Application } from 'egg';
import { TopicModel } from '../constants/interface/topic';

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const ObjectId = Schema.Types.ObjectId;
    const TopicSchema = new Schema({
        title: { type: String },
        content: { type: String },
        authour_id: { type: ObjectId },
        top: { type: Boolean, default: false },  // 是否置顶
        good: { type: Boolean, default: false },  // 精华帖
        reply_count: { type: Number, default: 0 },
        visit_count: { type: Number, default: 0 },
        create_date: { type: Date, default: Date.now },
        update_date: { type: Date, default: Date.now },
        last_replay: { type: ObjectId },
        last_replay_at: { type: Date },
    });
    TopicSchema.index({ create_date: -1 });
    TopicSchema.index({ top: -1, last_replay_at: -1 });
    return mongoose.model<TopicModel>('Topic', TopicSchema);
};
