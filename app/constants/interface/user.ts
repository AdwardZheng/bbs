import { Document } from 'mongoose';

export interface User {
    name: string;
    password: string;
    email: string;
    score: number;
    create_at: Date;
    update_at: Date;
}

export interface UserModel extends User, Document {
    getall: () => string;
}
