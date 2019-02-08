'use strict';

const { Interval, } = require('./Time.js');

(tests => tests.forEach(
	([args, expectation]) => {
		(
			args.length === 1 && args[0] instanceof Interval
			? args[0]
			: new Interval(...args)
		).length === expectation
		? void 0
		: console.error(
			'Input: ', args, '\n',
			'Expected output: ', expectation, '\n',
			'Actual output: ', new Interval(...args).length
		);
	}
))([
	[[], 0],
	[[NaN], 0],
	[[100], 100],
	[[100, 'ms'], 100],
	[[1, 's'], 1000],
	[['100'], 100],
	[['what_the_fuck'], 0],
	[['100', 'ms'], 100],
	[['1', 's'], 1000],
	[['100ms'], 100],
	[['1s'], 1000],
	[[new Interval('1s').extend('1s')], 2000],
	[[new Interval('1s').extend(1000)], 2000],
	[[new Interval('1s').shorten('500ms')], 500],
	[[new Interval('1s').shorten(new Interval(5, 's').stretch(1e-1))], 500],
	[[new Interval('1s').shorten(-2000)], 0],
	[[new Interval('1s').stretch(2)], 2000],
	[[new Interval('1s').stretch(0)], 0],
	[[new Interval('1s').stretch(1000)], 1e6],
]);