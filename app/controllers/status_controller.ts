import { Context } from 'koa';
import { Router } from '@/middlewares/router';

class StatusController {

	status: number; // 注意！该成员变量依赖于 server 生命周期，如果重启 server，将丢失修改

	constructor() {
		this.status = 1;
	}

	@Router(['GET', 'POST'])
	async index(ctx: Context) {
		ctx.body = this.status++;
	}

	@Router({
		method: 'GET',
		regular: '/:id',
	})
	async time(ctx: Context) {
		ctx.body = ctx.params;
	}
}

export default StatusController;