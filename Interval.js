{
	'use strict';

	const {
		give,
	} = require('./Library');

	const Interval = function Interval() {
		switch(arguments.length) {
			case 0: {
				this.length = 0;
				break;
			}
			case 1: {
				switch(true) {
					case typeof arguments[0] === 'string': {
						const [, length, unit] = arguments[0].match(
							/^\s*(\d*(?:\.\d+)?)\s*([^\d.]*\S*)\s*$/
						) || [];
						const multiply = Interval.units[unit] || +unit || 1;
						this.length = multiply * +length;
						break;
					}
					case arguments[0] instanceof Interval: {
						this.length = arguments[0].length;
						break;
					}
					default: {
						this.length = Math.abs(arguments[0]) || 0;
						break;
					}
				}
				break;
			}
			case 2: {
				const multiply = Interval.units[arguments[1]] || +arguments[1];
				this.length = multiply * +arguments[0];
			}
		}
	};
	Interval.units = {
		ms: 1,
		s: 1000,
	};
	give({
		extend(interval) {
			if(!(interval instanceof Interval)) {
				return this.extend(new Interval(...arguments));
			}
			this.length += interval.length;
			return this;
		},
		shorten(interval) {
			if(!(interval instanceof Interval)) {
				return this.shorten(new Interval(...arguments));
			}
			if(interval.length < this.length) {
				this.length -= interval.length;
			} else {
				this.length = 0;
			}
			return this;
		},
		stretch(multiply) {
			if(typeof multiply === 'string') {
				multiply = multiply.test(/%\s*$/)
				? 100 * +multiply.match(/^(.*)%\s*$/)[1]
				: +multiply;
			}
			if(!multiply && isNaN(multiply)) {
				multiply = 1;
			}
			this.length *= multiply;
			return this;
		},
	})(Interval.prototype);

	const Task = function Task() {
	};

	module.exports = Interval;
}