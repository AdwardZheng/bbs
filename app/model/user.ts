import { Application } from 'egg';
import { UserModel } from '../constants/interface/user';
export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        name: { type: String },
        password: { type: String },
        email: { type: String, unique: true },
        score: { type: Number, default: 0 },
        create_at: { type: Date, default: Date.now },
        update_at: { type: Date, default: Date.now },
        reply_count: { type: Number, default: 0 },
        loginname: { type: String },
    });

    UserSchema.index({ email: 1 }, { unique: true });

    return mongoose.model<UserModel>('User', UserSchema);
};
