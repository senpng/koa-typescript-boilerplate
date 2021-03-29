// tslint:disable:variable-name
// tslint:disable:no-shadowed-variable

import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
const debug = require('debug')('koa-typescript-boilerplate:router');
// fix vscode DEBUG CONSOLE not display.
// tslint:disable-next-line: no-console
debug.log = console.log.bind(console);
const pluralize = require('pluralize');

/**
 * [_routerVerb 可以注册的方法]
 */
const _routerVerb = ['get', 'post', 'put', 'patch', 'head', 'delete'];

function registerRoutes(options) {
  if (typeof options === 'string') {
    options = {root: options};
  } else if (!options || !options.root) {
    throw Error('`root` config required.');
  }

  const router = Router(options);
  const Domain = options.domain || '';

  const root = options.root;

  if (!fs.existsSync(root)) {
    debug('error : can\'t find root path ' + root);
    return async (ctx, next) => await next();
  }

  _ls(root).forEach(function(filePath) {
    if (!/([a-zA-Z0-9_\-]+)(\.(js|ts))$/.test(filePath)) {
      return;
    }

    const exportFuncs = require(filePath);
    const pathRegexp = _formatPath(filePath, root);

    getRoute(exportFuncs, function(exportFun, ctrlpath) {
      // support register class
      if (exportFun.toString().slice(0, 5) === 'class') {
        const clazz = exportFun;
        const obj = new clazz();
        const className = obj.constructor.name.toLowerCase().replace('controller', '');
        let _pathRegexp = pathRegexp.toLowerCase().replace('_controller', ''); // maybe xxx_controller
        _pathRegexp = _pathRegexp.toLowerCase().replace('controller', ''); // maybe xxxController、XxxController
        const exportFuncs = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
          .filter((v) => v !== 'constructor')
          .reduce((v, cur) => {
            const handler = obj[cur];
            if (handler.__router__ === undefined) {
              handler.__router__ = false;
            }
            v[cur] = handler;
            return v;
          }, {});
        if (!router.controllers) router.controllers = [];
        if (router.controllers[_pathRegexp]) throw Error('Duplicate controller: ${_pathRegexp}');
        getRoute(exportFuncs, function(exportFun, ctrlpath) {
          _setRoute(router, {
            domain: Domain,
            method: exportFun.__method__,
            regular: exportFun.__regular__,
            routePath: ctrlpath,
            handler: exportFun.bind(obj),
          }, options);
        }, [_pathRegexp, className]);
      } else {
        _setRoute(router, {
          domain: Domain,
          method: exportFun.__method__,
          regular: exportFun.__regular__,
          routePath: ctrlpath,
          handler: exportFun,
        }, options);
      }
    }, [pathRegexp]);
  });

  return router.routes();
}

function RouterConfig(options) {
  return function(target, propertyKey) {
    const _options = {
      method: ['GET', 'POST'],
    };
    if (typeof options === 'string') {
      _options.method = [options];
    } else if (options instanceof Array) {
      _options.method = options;
    } else if (typeof options.method === 'string') {
      _options.method = [options.method];
    } else if (options.method instanceof Array) {
      _options.method = options.method;
    }
    _options.method = _options.method.map((method) => method.toLowerCase());
    _options.regular = options.regular;
    _options.path = options.path;

    target[propertyKey].__router__ = true;
    target[propertyKey].__path__ = _options.path;
    target[propertyKey].__method__ = _options.method;
    if (_options.regular) {
      target[propertyKey].__regular__ = _options.regular;
    }
  };
}

exports = module.exports = {
  registerRoutes,
  Router: RouterConfig,
};

/**
 * 递归生成路由，层级不超过3级
 * @param  {Object|Function}  exportFuncs 获取到的路由
 * @param  {Array}            _routePath    路由记录
 * @return
 */
function getRoute(exportFuncs, cb, _routePath, _curCtrlname) {
  _routePath = _routePath || [];

  // 如果当前设置了不是路由，则直接返回
  if (exportFuncs.__router__ === false) {
    return;
  }

  // 解析method以及path "POST abc" => post:/abc
  if (_curCtrlname && _curCtrlname.indexOf(' ') > -1) {
    const splited = _curCtrlname.split(' ');
    exportFuncs.__method__ = splited[0].toLowerCase();
    _curCtrlname = splited[1];
  }

  // 去除path起始斜杠 "/abc" => abc
  if (_curCtrlname && _curCtrlname[0] === '/') {
    _curCtrlname = _curCtrlname.slice(1);
  }

  const totalCtrlname = _curCtrlname ? _routePath.concat([_curCtrlname]) : _routePath;

  // 只允许3级路由层级
  if (_routePath.length > 3) {
    debug(`嵌套路由对象层级不能超过3级：${totalCtrlname.join('/')}`);
    return;
  }

  // 如果是一个方法就直接执行cb
  if (typeof exportFuncs === 'function') {
    cb(exportFuncs, totalCtrlname);
  } else {
    // 否则进行循环递归查询
    for (const ctrlname in exportFuncs) {
      if (!exportFuncs.hasOwnProperty(ctrlname)) {
        continue;
      }

      getRoute(exportFuncs[ctrlname], cb, totalCtrlname, ctrlname);
    }
  }
}

/**
 * 设置路由
 * @param {string} path 当前文件路径
 * @param {object} config  配置项
 *        {string} config.method 当前请求方法：get,post等
 *        {string} config.regular 参考：https://github.com/alexmingoia/koa-router#nested-routers
 *        {funtion} config.handler controller方法
 *        {string} config.routePath 路由记录
 * @param {Obejct} options router配置
 */
function _setRoute(router, config, options) {
  const paths = [];
  if (typeof config.method === 'string') {
    config.method = [config.method];
  }
  if (!(config.method instanceof Array)) {
    config.method = ['GET', 'POST'];
  }
  config.method = config.method.map((method) => method.toLowerCase());
  const methods = config.method.filter((method) => _routerVerb.indexOf(method) > -1);
  let path = config.routePath.join('/');

  // 处理复数or同名orIndex /abc/abcs => /abcs, /abc/abc => /abc, /abc/index => /abc , /abc/default => /abc
  path = path.split('/').reduce(function(result, value) {
    const arr = result.split('/');
    const last = arr.pop();
    if (['index', 'default'].indexOf(value) !== -1) {
      return result;
    }
    if (last === pluralize(value, 1)) {
      arr.push(value);
      return arr.join('/');
    }
    return result + '/' + value;
  }, '') || '/';

  // 如果有regular则加入regular路由
  if (config.regular) {
    paths.push(path + config.regular);
  } else {
    // 加入当前路由
    paths.push(path);
  }

  // 对每一个method，有定义时唯一，默认post/get
  methods.forEach((method) => {
    // 注入路由
    paths.forEach((pathItem) => {
      debug(method + ':' + config.domain + pathItem);

      router[method](pathItem, config.handler);
    });
  });
}

/**
 * 查找目录中的所有文件
 * @param  {string} dir       查找路径
 * @param  {init}   _pending  递归参数，忽略
 * @param  {array}  _result   递归参数，忽略
 * @return {array}            文件list
 */
function _ls(dir, _pending, _result) {
  _pending = _pending ? _pending++ : 1;
  _result = _result || [];

  if (!path.isAbsolute(dir)) {
    dir = path.join(process.cwd(), dir);
  }

  // if error, throw it
  const stat = fs.lstatSync(dir);

  if (stat.isDirectory()) {
    const files = fs.readdirSync(dir);
    files.forEach(function(part) {
      _ls(path.join(dir, part), _pending, _result);
    });
    if (--_pending === 0) {
      return _result;
    }
  } else {
    _result.push(dir);
    if (--_pending === 0) {
      return _result;
    }
  }
}

/**
 * 格式化文件路径为koa-router的path
 * @param  {string} filePath 文件路径
 * @param  {string} root     router路径
 * @return {string}          过滤之后的path
 */
function _formatPath(filePath, root) {
  let dir = root;

  if (!path.isAbsolute(root)) {
    dir = path.join(process.cwd(), root);
  }

  // 修复windows下的\路径问题
  dir = dir.replace(/\\/g, '/');

  return filePath
    .replace(/\\/g, '/')
    .replace(dir, '')
    .split('.')[0];
}
