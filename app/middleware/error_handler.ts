import { Context, EggAppConfig, Application } from 'egg';

export default (options: EggAppConfig, app: Application) => {
    console.log(options);
    return async function errorHandler(ctx: Context, next: () => Promise<any>) {
        try {
            await next();
        } catch (err) {
            app.emit('error', err, ctx);
            const status = err.status || 500;
            const error_msg = status === 500 && app.config.env === 'prod'
                ? 'Internal Server Error'
                : err.message;
            ctx.body = { error_msg };
            ctx.body.success = false;
            if (status === 422) {
                ctx.body.detail = err.errors;
            }
            ctx.status = status;
        }
    };
};
