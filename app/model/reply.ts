import { Application } from 'egg';
import { ReplyModel } from '../constants/interface/reply';

export default (app: Application) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const ReplySchema = new Schema({
    content: { type: String },
    topic_id: { type: ObjectId },
    author_id: { type: ObjectId },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    liks: { type: [ ObjectId ], default: [] },
  }, {
    usePushEach: true,
  });

  ReplySchema.index({ topic_id: 1 });
  ReplySchema.index({ author_id: 1, create_at: -1 });

  return mongoose.model<ReplyModel>('Reply', ReplySchema);
};
