const five = require('johnny-five');
const _ = require('lodash');
const utils = require('./utilities');
const board = new five.Board();
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
const stopAndEnqueue = _.curry((animationRunner, animation) => {
  animationRunner.stop();
  animationRunner.enqueue(animation);
});
// generateMatryoshkaAnimation({Array[J5Servo], J5AnimationInstance, J5Segment}):J5Segment
// I didn't find a good way of enqueueing multiple J5Segments onto a J5AnimationInstance
// (e.g. J5AnimationInstance.enqueue(J5Segment, J5Segment, J5Segment)) since only the last J5Segment
// is respecred, it seems.
// Therefore, this specific FN is used to reduce many J5Segments into a single wired
// J5Segment that enqueues the next J5Segment on J5Segment.oncomplete, hence the "Matryoshka"
// analogy.  "Matryoshka" analogy makes sense if you think about it, trust me :)
const generateMatryoshkaAnimation = ({
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
    ...legServoPins.map(pin => ({pin, range: [0, 180], startAt: 90})),
    ...bodyServoPins.map(pin => ({pin, range: [45, 135], startAt: 90}))
  ]));
  const botAnimationRunner = new five.Animation(allServos);
  const resetAnimation = {
    duration: 3000,  // more time means greater dramatic effect
    keyFrames: _.times(8, _.constant([null, {degrees: 90}]))
  };
  const baseTestAnimation = {
    duration: 750,
    cuePoints: [0, 0.25, 0.5, 0.75, 1],
    keyFrames: _.times(8, () => _.times(3, _.constant(null))),
    oncomplete: () => console.log('override me!  This will display on last')
  };
  const singleTestAnimation = generateMatryoshkaAnimation({
    baseAnimation: _.cloneDeep(baseTestAnimation),
    // .map(_ => _) used here to get Array type from Object type
    targetCollection: allServos.map(a => a),
    animationRunner: botAnimationRunner
  });
  const continuousTestAnimation = generateMatryoshkaAnimation({
    baseAnimation: Object.assign(
      _.cloneDeep(baseTestAnimation),
      {
        oncomplete: () =>
          botAnimationRunner.enqueue(continuousTestAnimation)
      }
    ),
    // .map(_ => _) used here to get Array type from Object type
    targetCollection: allServos.map(a => a),
    animationRunner: botAnimationRunner
  });
  this.repl.inject({
    bot: {
      test: () => stopAndEnqueue(botAnimationRunner)(singleTestAnimation),
      continuousTest: () =>
        stopAndEnqueue(botAnimationRunner)(continuousTestAnimation),
      stop: () => stopAndEnqueue(botAnimationRunner)(resetAnimation)
    },
    allServos,
    botAnimationRunner,
    _
  });
  console.log('Try bot.test(), bot.continuousTest(), or bot.stop()');
});
