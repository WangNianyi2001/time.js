import EventEmitter from 'events';
import Interval from "./interval";

const getTimestamp = () => +new Date;

export default class Period extends EventEmitter {
	interval: Interval;
	get duration(): number {
		return this.interval.duration;
	}
	#playing: boolean = false;
	get playing(): boolean {
		return this.#playing;
	}
	#last_stop_progress: number = 0;
	#last_start_timestamp: number = 0;
	get progress(): number {
		const delta = this.#playing ? getTimestamp() - this.#last_start_timestamp : 0;
		return this.#last_stop_progress + delta;
	}
	#timer_id: any;

	constructor(interval: Interval) {
		super();
		this.interval = new Interval(interval);
	}

	start() {
		this.#last_stop_progress = 0;
		this.#last_start_timestamp = getTimestamp();
		this.#continue();
		this.#playing = true;
		this.emit('start');
	}
	stop() {
		clearTimeout(this.#timer_id);
		this.#last_stop_progress += this.progress;
		this.#playing = false;
		this.emit('stop');
	}
	#continue() {
		this.#timer_id = setTimeout(
			this.#finish.bind(this),
			this.duration - this.progress
		);
	}
	#finish() {
		this.stop();
		this.emit('finish');
	}
	restart() {
		if(this.#playing)
			this.stop();
		this.emit('restart');
		this.start();
	}
	resume() {
		if(this.#playing)
			return;
		this.#playing = true;
		this.#last_start_timestamp = getTimestamp();
		this.#continue();
		this.emit('resume');
	}
	pause() {
		if(!this.#playing)
			return;
		this.#last_stop_progress = this.progress;
		this.#playing = false;
		clearTimeout(this.#timer_id);
		this.emit('pause');
	}
}
