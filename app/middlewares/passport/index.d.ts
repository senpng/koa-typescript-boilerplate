import Koa from 'koa'

export interface PassportOptions {
  sessionOptions: Object
  serializeUserFn: (user: any, done: (error: Error | null, id: number) => void) => void
  deserializeUserFn: (id: number, done: (error: Error | null, user?: any) => void) => void
}

export declare function passport(app: Koa<any, {}>, options: PassportOptions): any