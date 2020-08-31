import { IRouterOptions } from 'koa-router'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE'

export declare function registerRoutes(options: string | { root: string } & IRouterOptions): any

export declare function Router(options: { method: Method | Method[], regular?: string } | Method | Method[]): Function