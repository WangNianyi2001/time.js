{
	'use strict';

	const {
		give,
	} = require('./Library');

	const Interval = function Interval() {
		switch(arguments.length) {
			case 0: {
				this.duration = 0;
				break;
			}
			case 1: {
				switch(true) {
					case typeof arguments[0] === 'string': {
						const [, duration, unit] = arguments[0].match(
							/^\s*(\d*(?:\.\d+)?)\s*([^\d.]*\S*)\s*$/
						) || [];
						const multiply = Interval.units[unit] || +unit || 1;
						this.duration = multiply * +duration;
						break;
					}
					case arguments[0] instanceof Interval: {
						this.duration = arguments[0].duration;
						break;
					}
					default: {
						this.duration = Math.abs(arguments[0]) || 0;
						break;
					}
				}
				break;
			}
			case 2: {
				const multiply = Interval.units[arguments[1]] || +arguments[1];
				this.duration = multiply * +arguments[0];
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
			this.duration += interval.duration;
			return this;
		},
		shorten(interval) {
			if(!(interval instanceof Interval)) {
				return this.shorten(new Interval(...arguments));
			}
			if(interval.duration < this.duration) {
				this.duration -= interval.duration;
			} else {
				this.duration = 0;
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
			this.duration *= multiply;
			return this;
		},
	})(Interval.prototype);

	module.exports = Interval;
}