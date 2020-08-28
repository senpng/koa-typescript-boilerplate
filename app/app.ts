import http from 'http'
import Koa from 'koa'
import koaLogger from 'koa-logger'
import KoaCompress from 'koa-compress'
import KoaBody from 'koa-body'
// import KoaMount from 'koa-mount'
import KoaStatic from 'koa-static'
import { createConnection } from 'typeorm'
import config from './config'
import * as Middlewares from './middlewares'
import UserService from './services/user'
import { SnakeCaseNamingStrategy } from './models/typeorm/naming_strategy'

const app = new Koa()
app.proxy = true // get public ip
if (process.env.NODE_ENV) {
  app.env = process.env.NODE_ENV
}

app.use(koaLogger())

// Processing cross-domain
app.use(async (ctx, next) => {

  const requestOrigin = ctx.get('Origin')
  ctx.vary('Orgin')

  if (!requestOrigin) {
    await next()
    return
  }

  ctx.set('Access-Control-Allow-Origin', requestOrigin)
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
  ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type, authorization')

  if (ctx.request.method === 'OPTIONS') {
    ctx.status = 200
    return
  }

  await next()
})

createConnection({
  ...config.mysql,
  type: 'mysql',
  entities: [
    __dirname + '/models/typeorm/entities/*.ts',
  ],
  namingStrategy: new SnakeCaseNamingStrategy(),
  // extra: {
  //   typeCast: (field: any, next: any) => {
  //     if (field.type === 'TIMESTAMP') {
  //       return new Date(field.string() + 'Z') // can be 'Z' for UTC or an offset in the form '+HH:MM' or '-HH:MM'
  //     }
  //     return next()
  //   },
  // },
}).then(async () => {
  // here you can start to work with your entities
  // tslint:disable-next-line: no-console
}).catch(error => console.log('TypeORM connection error: ' + error))

// session & auth
app.keys = ['koa-typescript-boilerplate']// session-secret
app.use(Middlewares.passport(app, {
  sessionOptions: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
    key: 'koa-typescript-boilerplate',
    renew: true,
    rolling: false,
  },
  serializeUserFn: async (user, done) => {
    done(null, user.id)
  },
  deserializeUserFn: async (id, done) => {
    try {
      const user = await UserService.get(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  },
}))

// Simple interface permission control
app.use(async (ctx, next) => {
  const authPath = [/^\/api\/user\/(?!logout)/]// 黑名单，需要登录权限
  let needAuth = false
  for (const reg of authPath) {
    if (typeof reg === 'string') {
      if (reg === ctx.path) {
        needAuth = true
        break
      }
    } else {
      if (reg.test(ctx.path)) {
        needAuth = true
      }
    }
  }

  if (!needAuth || ctx.isAuthenticated()) {
    await next()
    return
  }

  ctx.throw(403, '请登录')
})

// Compress
app.use(KoaCompress())

// body parse
app.use(KoaBody({
  multipart: true,
}))

// Standardized error output
app.context.onerror = function(err: any) {
  if (err == null) { return }

  // ignore all pedding request stream
  if (this.req) {
    const sendToWormhole = require('stream-wormhole')
    sendToWormhole(this.req)
  }

  // delegate
  this.app.emit('error', err, this)

  // ENOENT support
  if (err.code === 'ENOENT') { err.status = 404 }

  if (typeof err.status !== 'number' || !http.STATUS_CODES[err.status]) {
    err.status = 500
  }
  this.status = err.status
  this.set({})

  this.type = 'json'
  this.body = {
    error: err.message,
  }
  this.res.end(JSON.stringify(this.body))
}

// Injecting routers
app.use(Middlewares.router.registerRoutes(__dirname + '/controllers'))

// Static resource access
app.use(KoaStatic(__dirname + '/public'))

// Mount docs
// app.use(KoaMount('/docs', KoaStatic('docs')))

export default app
