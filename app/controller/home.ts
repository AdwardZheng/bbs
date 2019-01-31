import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const name: string = String(Date.now());
    ctx.cookies.set('name', name);
    console.log(name);
    ctx.body = await ctx.service.test.sayHi('egg');
  }
}
