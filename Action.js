{
	'use strict';

	const {
		nulf,
		give,
		getTimestamp,
	} = require('./Library'),
	Interval = require('./Interval');

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
			'continue',
		]),
	})(ActionEvent);

	const Action = function Action(length, events) {
		this.length = new Interval(length);
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
			}, this.length.length - this.progress);
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
		continue() {
			this.timestamp = getTimestamp();
			this.timer = setTimeout(() => {
				this.callEvent('finish');
			}, this.length.length - this.progress);
			this.callEvent('continue');
		},
	})(Action.prototype);

	module.exports = Action;
}