const five = require('johnny-five');
const _ = require('lodash');
const utils = require('./utilities');
const board = new five.Board();
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
// Find BPM values here: http://music.stackexchange.com/questions/4525/list-of-average-genre-tempo-bpm-levels
// Find specific song BPM values here: https://jog.fm/workout-songs
const beatsPerMinute = 205;
const DANCE_TIMING = 1000 / (beatsPerMinute / 60);
console.log('DANCE_TIMING', DANCE_TIMING);
const stopAndEnqueue = _.curry((animationRunner, animation) => {
  animationRunner.stop();
  animationRunner.enqueue(animation);
});
// generateLinkedAnimationJSObj({Array[J5Servo], J5AnimationInstance, J5Segment}):J5Segment
const generateLinkedAnimationJSObj = ({
  targetCollection,
  animationRunner,
  baseAnimation
}) => targetCollection.reduce(
  (cumulativeAnimation, {startAt, range: [low, high]}, index) =>
    [...cumulativeAnimation, _.set(
      _.cloneDeep(baseAnimation),
      `keyFrames[${index}]`,
      [{degrees: 90}, -45, 90, {degrees: 90}]
    )],
    []
  )
  .reverse()
  .reduce((accum = {}, animation, index) => {
    if (index == 0) {
      return animation;  // smallest Matryoshka doll has no doll inside
    } else {
      return _.set(
        _.cloneDeep(animation),
        'oncomplete',
        () => animationRunner.enqueue(accum)
      );
    }
  });

board.on('ready', function () {
  const allServos = new five.Servos(utils.sortServosByPin([
    ...legServoPins.map(pin => ({pin, range: [0, 180], startAt: 90, type: 'leg'})),
    ...bodyServoPins.map(pin => ({pin, range: [45, 135], startAt: 90, type: 'body'}))
  ]));
  const bodyServos = allServos.map(a => a).filter(({type}) => type == 'body');
  const legServos = allServos.map(a => a).filter(({type}) => type == 'leg');
  // Name Schema: (R"ight" || L"eft") + (B"ack" || F"ront") + (B"ody" || L"eg")
  //   e.g. LBL == "Left Back Leg"
  const [
    LBL, LBB, LFB, LFL,
    RBL, RBB, RFB, RFL
  ] = allServos.map(a => a);
  const botAnimationRunner = new five.Animation(allServos);
  const resetAnimation = {
    duration: 3000,  // more time means greater dramatic effect
    keyFrames: _.times(8, _.constant([null, {degrees: 90}]))
  };
  const baseTestAnimation = {
    duration: 500,
    cuePoints: [0, 0.25, 0.5, 0.75, 1],
    keyFrames: _.times(8, () => _.times(3, _.constant(null))),
    oncomplete: () => console.log('override me!  This will display on last')
  };
  const singleTestAnimation = generateLinkedAnimationJSObj({
    baseAnimation: _.cloneDeep(baseTestAnimation),
    // .map(_ => _) used here to get Array type from Object type
    targetCollection: allServos.map(a => a),
    animationRunner: botAnimationRunner
  });
  let danceMoves = [];
  const bot = {
    test: () => stopAndEnqueue(botAnimationRunner)(singleTestAnimation),
    stop: () => stopAndEnqueue(botAnimationRunner)(resetAnimation),
    turnRight: (timing = 135) => {
      bodyServos.map(servo => servo.to(servo.range[1], timing));
      [RFL].map(servo => servo.to(120, timing));
      [LFL].map(servo => servo.to(140, timing));
    },
    turnLeft: (timing = 135) => {
      bodyServos.map(servo => servo.to(servo.range[0], timing));
      [RFL].map(servo => servo.to(140, timing));
      [LFL].map(servo => servo.to(120, timing));
    },
    expandFrontLegs: (toValue = 100) => {
      [LFL, RFL].map(servo => servo.to(toValue, 250));
    },
    straightenUp: () => {
      allServos.map(servo => servo.to(servo.startAt, 250));
    },
    dance: (danceList = danceMoves, danceTiming = DANCE_TIMING) => {
      return danceList.map((moveFn, index) =>
        setTimeout(() => moveFn(danceTiming), index * danceTiming)
      );
    },
    continuousDance: (danceList = danceMoves, danceTiming = DANCE_TIMING) => {
      // Matt & Kim https://www.youtube.com/watch?v=S3fe8yNl6jg
      let dance = bot.dance(danceList, danceTiming);
      const danceLength = dance.length;
      const intervalTime = danceTiming * danceLength;
      return setInterval(
        () => dance = bot.dance(danceList, danceTiming),
        intervalTime
      );
    }
  }
  danceMoves = [
    bot.turnRight,
    bot.straightenUp,
    bot.turnLeft,
    bot.straightenUp,
    //
    // bot.expandFrontLegs,
    // bot.straightenUp,
    // bot.expandFrontLegs,
    // bot.straightenUp
  ];
  this.repl.inject({
    bot,
    danceMoves,
    allServos,
    bodyServos,
    legServos,
    botAnimationRunner,
    _
  });
  console.log('Try bot.test(), bot.dance(), or bot.continuousDance()');
});
