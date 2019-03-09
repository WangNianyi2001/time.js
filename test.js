(() => {
	'use strict';

<<<<<<< Updated upstream
const {
	Interval,
} = require('./Time');

(tests => {
	let error_count = 0;
	tests.forEach(
		([args, expectation]) => {
			if(!(
				(
					args.length === 1 && args[0] instanceof Interval
					? args[0]
					: new Interval(...args)
				).length === expectation
			)) {
				++error_count;
				console.error(
					'Input: ', args, '\n',
					'Expected output: ', expectation, '\n',
					'Actual output: ', new Interval(...args).length
				);
			}
		}
	);
	if(error_count === 0) {
		console.log('All passed');
	}
})([
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
=======
	const $ = require('./Library');

	const fns = Array(4).fill(0).map((_, i) => str => str + i.toString());
	console.log($.compose(...fns)(''));
	console.log($.composeRight(...fns)(''));

	return;

	const {
		Interval,
		Task,
	} = require('./Time');

	// Interval tests
	{
		(tests => {
			let error_count = 0;
			tests.forEach(
				([args, expectation]) => {
					if(!(
						(
							args.length === 1 && args[0] instanceof Interval
							? args[0]
							: new Interval(...args)
						).length === expectation
					)) {
						++error_count;
						console.error(
							'Input: ', args, '\n',
							'Expected output: ', expectation, '\n',
							'Actual output: ', new Interval(...args).length
						);
					}
				}
			);
			if(error_count === 0) {
				console.log('Interval tests all passed');
			}
		})([
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
	}

	// Task tests
	{
		const task_validator = (length, mode, frequency) => (...args) => {
			if(args.length === 0) {
				return [mode, frequency, length];
			}
			const task = new Task(...args[0]);
			return [
				task.mode === mode,
				task.frequency.length === frequency,
				task.length.length === length
			];
		};
		(tests => {
			let error_count = 0;
			tests.forEach(
				([args, validate]) => {
					if(!validate(args).every(x => x)) {
						++error_count;
						console.error(
							'Input: ', args, '\n',
							'Expected output: ', validate(), '\n',
							'Actual output: ', new Task(...args)
						);
					}
				}
			);
			if(error_count === 0) {
				console.log('Task tests all passed');
			}
		})([
			[[], task_validator(0, 'event', 0)],
			[[1], task_validator(1, 'event', 0)],
			[['1s'], task_validator(1000, 'event', 0)],
			[['1s', 'event'], task_validator(1000, 'event', 0)],
			[['1s', 'event', {}], task_validator(1000, 'event', 0)],
			[['1s', 'yield'], task_validator(1000, 'yield', 0)],
			[['1s', 'yield', '2ms'], task_validator(1000, 'yield', 2)],
			[['1s', 'both', '2ms', {}], task_validator(1000, 'both', 2)],
		]);
	}
})();
>>>>>>> Stashed changes
