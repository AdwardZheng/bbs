import { Document } from 'mongoose';

export interface User {
    name: string;
    password: string;
    email: string;
    score: number;
    create_date: Date;
    update_date: Date;
}

export interface UserModel extends User, Document {
    getall: () => string;
}
