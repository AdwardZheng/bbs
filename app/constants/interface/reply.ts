import { Types, Document } from 'mongoose';
export interface Reply {
    content: string;
    topic_id: Types.ObjectId;
    author_id: Types.ObjectId;
    create_at: Date;
    update_at: Date;
}

export interface ReplyModel extends Reply, Document {

}
