{
	'use strict';

	const Interval = function Interval() {
		this.duration = null;
		switch(arguments.length) {
			case 0: {
				this.duration = 0;
				break;
			}
			case 1: {
				if(arguments[0] instanceof Interval)
					this.duration = arguments[0].duration;
				else if(typeof arguments[0] === 'string')
					this.duration = arguments[0].duration;
				else
					this.duration = Math.abs(arguments[0]) || 0;
				break;
			}
			case 2: {
				const unit_scalar = Interval.units.get(arguments[1]) || +arguments[1];
				this.duration = unit_scalar * +arguments[0];
				break;
			}
		}
	};
	Interval.units = new Map([['ms', 1], ['s', 1000]]);
	Interval.prototype = {
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
		stretch(scalar) {
			if(typeof scalar === 'string') {
				scalar = scalar.test(/%\s*$/)
				? 100 * +scalar.match(/^(.*)%\s*$/)[1]
				: +scalar;
			}
			if(!scalar && isNaN(scalar)) {
				scalar = 1;
			}
			this.duration *= scalar;
			return this;
		},
	};

	const nulf = () => {};
	const getTimestamp = () => +new Date;

	const Action = function Action(...duration) {
		this._duration = new Interval(...duration);
		this._events = new Map(Array.from(Action.event_types).map(type => [type, new Set()]));
		this._playing = false;
		this._last_stopping_progress = 0;
		this._timer_id = null;
		this._last_starting_timestamp = null;
	};
	Action.event_types = new Set('start,finish,restart,stop,pause,resume'.split(','));

	Action.prototype = {
		bindEvent(type, callback) {
			this._events.get(type).add(callback);
		},
		unbindEvent(type, callback) {
			this.events.get(type).delete(callback);
		},
		flushEvent(type) {
			if(!type) {
				for(const type of Action.event_types.values())
					this.flushEvent(type);
				return;
			}
			this.events.get(type).clear();
		},
		triggerEvent(type, ...args) {
			for(const event of this._events.get(type))
				event.apply(this, args);
		},
		get playing() { return this._playing; },
		get progress() {
			return this._last_stopping_progress + (this.playing ? getTimestamp() - this._last_starting_timestamp : 0);
		},
		get duration() { return this._duration.duration; },
		start() {
			this._playing = true;
			this._last_stopping_progress = 0;
			this._last_starting_timestamp = getTimestamp();
			this._timer_id = setTimeout(() => {
				this.stop();
				this.triggerEvent('finish');
			}, this.duration - this._last_stopping_progress);
			this.triggerEvent('start');
		},
		stop() {
			this._playing = false;
			clearTimeout(this._timer_id);
			this._last_stopping_progress += this.progress;
			this.triggerEvent('stop');
		},
		restart() {
			this.stop();
			this.triggerEvent('restart');
			this.start();
		},
		pause() {
			if(this._playing) {
				this._last_stopping_progress = this.progress;
				this._playing = false;
				clearTimeout(this._timer_id);
			}
			this.triggerEvent('pause');
		},
		resume() {
			if(!this._playing) {
				this._playing = true;
				this._last_starting_timestamp = getTimestamp();
				this._timer_id = setTimeout(
					Action.prototype.triggerEvent.bind(this, 'finish'),
					this.duration - this.progress
				);
			}
			this.triggerEvent('resume');
		},
	};

	window.Time = { Interval, Action };
}