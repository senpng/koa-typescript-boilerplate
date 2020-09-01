// tslint:disable:no-empty

import session from 'koa-session';
import passport from 'koa-passport';

exports = module.exports = function(app, options) {

	const defaultOption = {
		sessionOptions: {},
		serializeUserFn: async (user, done) => { },
		deserializeUserFn: async (id, done) => { },
	};
	options = { ...defaultOption, ...options };

	app.use(session(options.sessionOptions, app));

	passport.serializeUser(options.serializeUserFn);
	passport.deserializeUser(options.deserializeUserFn);

	app.use(passport.initialize());
	app.use(passport.session());
	app.context.passport = passport;

	return async (ctx, next) => await next();
};
