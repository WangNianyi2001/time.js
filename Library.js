{
	'use strict';

	const Library = {
		give: properties => object => Object.keys(properties).forEach(
			key => Object.defineProperty(object, key, Object.getOwnPropertyDescriptor(properties, key))
		),
	};

	module.exports = Library;
}