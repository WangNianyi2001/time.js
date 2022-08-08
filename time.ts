export class Interval {
	static pattern: RegExp = /^((?:[1-9]\d*|0)(?:\.\d+)?)([a-zA-Z]*)$/;
	static units = new Map([
		['ms', 1],
		['s', 1000]
	]);

	duration: number;

	#Init(duration: number, unit: string = 'ms') {
		duration = Math.max(duration, 0);
		if(isNaN(duration))
			throw new RangeError('Trying to create an interval with duration NaN');
		if(!Interval.units.has(unit))
			throw new TypeError(`"${unit}" is not a valid duration unit`);
		this.duration = duration;
	}

	constructor(duration: Interval | number | string, unit?: string) {
		if(unit === undefined) {
			if(duration instanceof Interval) {
				this.duration = duration.duration;
			} else if(typeof duration === 'number') {
				this.duration = Math.max(duration, 0);
			} else {
				// duration is string
				const match = duration.match(Interval.pattern);
				if(!match)
					throw new SyntaxError('Invalid duration format');
				this.#Init(+match[1], match[2]);
			}
		} else
			this.#Init(+duration, unit);
	}

	extend(interval: Interval) {
		this.duration += interval.duration;
		return this;
	}
	shorten(interval: Interval) {
		this.duration = Math.max(0, this.duration - interval.duration);
		return this;
	}
	stretch(scalar: number) {
		scalar = Math.max(scalar, 0);
		if(isNaN(scalar))
			scalar = 0;
		this.duration *= scalar;
		return this;
	}
}
