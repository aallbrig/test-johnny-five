const _ = require('lodash');
const five = require('johnny-five');
const Bot = require('./classes/Bot');
const { generateLinkedAnimationJSObj, sortServosByPin } = require('./utilities');
const board = new five.Board();
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
// Find BPM values here: http://music.stackexchange.com/questions/4525/list-of-average-genre-tempo-bpm-levels
// Find specific song BPM values here: https://jog.fm/workout-songs
const beatsPerMinute = 125;
const DANCE_TIMING = (1000 / (beatsPerMinute / 60)) / 2;
console.log('DANCE_TIMING', DANCE_TIMING);

board.on('ready', function () {
  const allServos = new five.Servos(sortServosByPin([
    ...legServoPins.map(pin => ({pin, range: [45, 135], startAt: 90, type: 'leg'})),
    ...bodyServoPins.map(pin => ({pin, range: [45, 135], startAt: 90, type: 'body'}))
  ]));
  const bot = new Bot({
    allServos,
    animationRunner: new five.Animation(allServos),
    danceTiming: DANCE_TIMING
  });
  bot.danceMoves = [
    bot.turnRight,
    bot.straightenUp,
    bot.turnLeft,
    bot.straightenUp,

    bot.expandFrontLegs,
    bot.straightenUp,
    bot.expandFrontLegs,
    bot.straightenUp
  ];
  this.repl.inject({
    bot,
    _
  });
  console.log('Try bot.test(), bot.dance(), or bot.continuousDance()');
});
