import { Context } from 'koa';

// export async function index(ctx: Context) {
//   ctx.body = new Date()
// }

export async function ping(ctx: Context) {
	ctx.body = 'pong';
}
