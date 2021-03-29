import {Context} from 'koa';

self.__method__ = 'GET';
export async function self(ctx: Context) {
  ctx.body = ctx.state.user;
}

logout.__method__ = 'PUT';
export async function logout(ctx: Context) {
  ctx.logout();
  ctx.body = '';
}

user.__method__ = 'POST';
export async function user(ctx: Context) {
  ctx.body = ctx.request.body;
}

users.__method__ = 'GET';
export async function users(ctx: Context) {
  ctx.body = '';
}

/** equal 'GET /users/:id', 'DELETE /users/:id' */
// users.__method__ = ['GET', 'DELETE']
// users.__regular__ = '/:id'
// export async function users(ctx: Context) {
//   ctx.body = ctx.params
// }

export default {
  'GET /users/:id': async (ctx: Context) => {
    ctx.body = ctx.params;
  },
  'POST /users/:id/friends': async (ctx: Context) => {
    ctx.body = ctx.params;
  },
};
