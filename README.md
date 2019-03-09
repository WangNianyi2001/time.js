# Time.js

`Time.js` is a lightweight JavaScript library that provides you simple APIs to manage temporal stuffs.

With the help of `Time.js`, you can now add the time dimension into your projects without struggling through the messy native JavaScript timing APIs.

`Time.js` has integrated 2 classes (for now): `Interval` and `Action`. Please read the guidance presented below to get started.

## Interval

As its name suggested, `Interval` represent a measure of how long an action would last.

The constructor of `Interval` is designed to be flexible, you can instantiate an interval by passing its duration and an optinal unit in either a string or a number value.

Here are some examples:

```js
new Interval(1) // 1 millisecond
new Interval('1') // 1 millisecond
new Interval('1s') // 1 second
new Interval(1, 's') // 1 second
new Interval('1', 's') // 1 second
```

You can modify the duration of an interval by calling its member functions, there are 3 of them:

- `extend(interval)` extends the current interval by certain interval.
- `shorten(interval)` shortens the current interval by certain interval. A zero length would be set when the given interval is longer than the current one.
- `stretch(ratio)` multiplies the current interval with certain ratio. The abstract value would be used if the given ratio is negative.

All occurrence of intervals passed as argument in `Time.js` will be automatically transformed into an instance of `Interval`, so you don't have to do the convertion manually every time.

## Action

An `Action` is a series of events happening sequentially in a certain interval you've assigned earlier.

The constructor of `Action` receives 2 arguments: its duration and its event listeners.

There are 6 types of events supported by `Time.js`, here is a list of them:

- `start` triggers when `.start()` is called or before restarting.
- `finish` triggers when an action ends naturally as it reaches its end.
- `restart` triggers when `.restart()` is called.
- `stop` triggers when `.stop()` is called or after restarting.
- `pause` triggers when `.pause()` is called.
- `resume` triggers when `.resume()` is called.

Here are a few pitfalls to notice:

- `start` will not trigger if you resumed an action at its beginning, so will `finish` at the end.
- `resume` will not trigger when `.start()` is called, this happens similarly on `pause` and `stop()`.
- The correct trigger sequence of restarting is `stop`-`restart`-`start`.

You can operate an `Action` instance by calling its member functions `.start()`, `.restart()`, `.stop()`, `.pause()` and `.resume()`.

## What's next

I'm thinking of implementing something like a timeline or something, where you can put actions into sequence and hit play, then they'll do their jobs like notes on the sheets. Of course you can insert breaks inbetween them.

You know what, the original movitivation of this project is actually me wanting to make a rap flow visualizer, which will require a lot of timing works to mess with.

More possibilities like parallel/decorative timelines would be considered, since there are a lot of sound effects or decorative tracks appeared in songs, which will probably conflict with the main lyrics/melody.

If you have any ideas for this project, please create a new issue in order for me to know!