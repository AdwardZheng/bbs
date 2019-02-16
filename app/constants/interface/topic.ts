import { Document, Types } from 'mongoose';
export interface Topic {
    title: string;
    content: string;
    author_id: Types.ObjectId;
    top: boolean;
    good: boolean;
    reply_count: number;
    visit_count: number;
    create_at: Date;
    update_at: Date;
    last_reply: Types.ObjectId;
    last_reply_at: Date;
    tab: string;
}

export interface TopicModel extends Topic, Document {

}
