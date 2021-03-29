import Koa from 'koa';

declare function passport(app: Koa<any, {}>, options: passport.PassportOptions): any

declare namespace passport {
  interface PassportOptions {
    sessionOptions: Object
    serializeUserFn: (user: any, done: (error: Error | null, id: number) => void) => void
    deserializeUserFn: (id: number, done: (error: Error | null, user?: any) => void) => void
  }
}

export = passport
