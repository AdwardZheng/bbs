import { Controller } from 'egg';
export default class UserController extends Controller {
    // 注册
    async signup() {
        const { ctx, service } = this;
        const paramas = ctx.query;
        const { name, email, password } = paramas;

        // 检查参数
        const createRule = {
            name: { type: 'string', required: true, trim: true },
            email: { type: 'string', required: true, trim: true },
            password: { type: 'string', required: true, trim: true },
        };

        ctx.validate(createRule, paramas);
        const user = await service.user.getUserByPointWord({
            $or: [
                { name },
                { email },
            ],
        }, {});
        if (user.length > 0) return ctx.body = '用户已存在';

        await service.user.addNewUser(name, password , email);
        ctx.body = JSON.stringify(paramas);
    }
}
