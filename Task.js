{
	'use strict';

	const {
		nulf,
		give,
		getTimestamp,
	} = require('./Library'),
	Interval = require('./Interval');

	const TaskEvent = function(events = []) {
		TaskEvent.event_names.forEach(
			name => this[name] = (fn => fn instanceof Function ? fn : nulf)(events[name])
		);
	};
	give({
		event_names: new Set([
			'start',
			'finish',
			'stop',
			'pause',
			'continue',
		]),
	})(TaskEvent);

	const Task = function Task(length, events) {
		this.length = new Interval(length);
		this.events = new TaskEvent(events);
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
	})(Task.prototype);

	module.exports = Task;
}