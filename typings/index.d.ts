import 'egg';

declare module 'egg' {
    export interface Application {
        passport: any;
    }
}