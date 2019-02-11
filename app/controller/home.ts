import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const name = ctx.query.name;
    console.log(name);
    console.log(name ? ctx.helper.trim(name) : '');
    // ctx.body = await ctx.service.test.sayHi('egg');
    ctx.body = await ctx.service.user.test();
  }
}
