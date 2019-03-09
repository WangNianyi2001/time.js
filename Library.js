{
	'use strict';

	const nulf = () => {};
	const identity = obj => obj;

	const parseNumber = obj => isNaN(obj) && obj || 0;

	const getTimestamp = () => +new Date;

	const give = properties => object => Object.keys(properties).forEach(
		key => Object.defineProperty(object, key, Object.getOwnPropertyDescriptor(properties, key))
	);

	const compose = (...fns) => !fns.length ? identity : ((outer, inner) => (...args) => outer(inner(...args)))(fns.shift(), compose(...fns));
	const composeRight = (...fns) => !fns.length ? identity : ((outer, inner) => (...args) => outer(inner(...args)))(fns.pop(), composeRight(...fns));

	const isPrimitive = (map => obj => map[typeof obj] || obj === null || false)({
		number: true,
		string: true,
		symbol: true,
		undefined: true,
		boolean: true,
	});

	const equal = (a, b, a_stack, b_stack) => {
		if(typeof a !== typeof b) {
			return false;
		}
		if([a, b].every(isPrimitive)) {
			// +0 !== -0
			if(a.__proto__ === Number.prototype) {
				return 1 / a === 1 / b;
			}
			return a === b;
		}
		// Rule out objects that are definitely unequal
		if(
			a.__proto__ !== b.__proto__ ||
			a.prototype !== b.prototype ||
			a.constructor !== b.constructor
		) {
			return false;
		}
		const [a_des, b_des] = [a, b].map(
			obj => Object.keys(Object.getOwnPropertyDescriptor(obj))
		);
		// TODO
	};

	const Library = {
		nulf,
		identity,
		parseNumber,
		getTimestamp,
		give,
		compose,
		composeRight,
		isPrimitive,
		equal: (a, b) => equal(a, b, [], []),
	};

	module.exports = Library;
}