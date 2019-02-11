import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const name = ctx.query.name;
    console.log(name.tirm());
    // ctx.body = await ctx.service.test.sayHi('egg');
    ctx.body = await ctx.service.user.test();
  }
}
