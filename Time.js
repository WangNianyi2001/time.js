{
	'use strict';

	const give = properties => object => Object.keys(properties).forEach(
		key => Object.defineProperty(object, key, Object.getOwnPropertyDescriptor(properties, key))
	);

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

	const nulf = () => {};
	const getTimestamp = () => +new Date;

	const ActionEvent = function(events = []) {
		ActionEvent.event_names.forEach(
			name => this[name] = (fn => fn instanceof Function ? fn : nulf)(events[name])
		);
	};
	give({
		event_names: new Set([
			'start',
			'finish',
			'restart',
			'stop',
			'pause',
			'resume',
		]),
	})(ActionEvent);

	const Action = function Action(duration, events) {
		this.duration = new Interval(duration);
		this.events = new ActionEvent(events);
		this.progress = 0;
		this.timer = null;
		this.timestamp = null;
	};

	give({
		callEvent(name, ...args) {
			this.events[name].apply(this, args);
		},
		start() {
			this.progress = 0;
			this.timestamp = getTimestamp();
			this.timer = setTimeout(() => {
				this.stop();
				this.callEvent('finish');
			}, this.duration.duration - this.progress);
			this.callEvent('start');
		},
		stop() {
			clearTimeout(this.timer);
			this.progress += getTimestamp() - this.timestamp;
			this.callEvent('stop');
		},
		restart() {
			this.stop();
			this.callEvent('restart');
			this.start();
		},
		pause() {
			clearTimeout(this.timer);
			this.progress = getTimestamp() - this.timestamp;
			this.callEvent('pause');
		},
		resume() {
			this.timestamp = getTimestamp();
			this.timer = setTimeout(() => {
				this.callEvent('finish');
			}, this.duration.duration - this.progress);
			this.callEvent('resume');
		},
	})(Action.prototype);

	window.Time = { Interval, Action };
}