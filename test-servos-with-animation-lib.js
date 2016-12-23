const five = require('johnny-five');
const _ = require('lodash');
const board = new five.Board();
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
const sortServosByPin = (servos) => servos.sort((a, b) => a.pin < b.pin);
const stopAndEnqueue = _.curry((animationRunner, animation) => {
  animationRunner.stop();
  animationRunner.enqueue(animation);
});
const generateMatryoshkaAnimation = ({
  targetCollection,
  animationRunner,
  baseAnimation
}) => {
  // TODO: More work to make this function more generic
  const allAnimations = targetCollection.reduce(
    (cumulativeAnimation, {startAt, range: [low, high]}, index) =>
      [...cumulativeAnimation, _.set(
        _.cloneDeep(baseAnimation),
        `keyFrames[${index}]`,
        [{degrees: 90}, -45, 90, {degrees: 90}]
      )],
    []
  );
  // It's like Russian Matryoshka doll and you gotta build from "smallest" to "larger" (hence .reverse()!)
  // If that doesn't make sense then you probably don't get what's going on in the next few expressions.
  const linkedAnimations = allAnimations
    .reverse()
    .reduce((accum, animation, index) => {
      if (index == 0) {
        return animation;  // smallest Matryoshka doll has no doll inside
      } else {
        return _.set(
          _.cloneDeep(animation),
          'oncomplete',
          () => animationRunner.enqueue(accum)
        );
      }
    }, {});
  return linkedAnimations
}

board.on('ready', function () {
  const allServos = new five.Servos(sortServosByPin([
    ...legServoPins.map(pin => ({pin, range: [0, 180], startAt: 90})),
    ...bodyServoPins.map(pin => ({pin, range: [45, 135], startAt: 90}))
  ]));
  const continuousTestServos = new five.Animation(allServos);
  const resetAnimation = {
    duration: 3000,  // more time means greater dramatic effect
    keyFrames: [
      [ null, {degrees: 90}],
      [ null, {degrees: 90}],
      [ null, {degrees: 90}],
      [ null, {degrees: 90}],
      [ null, {degrees: 90}],
      [ null, {degrees: 90}],
      [ null, {degrees: 90}],
      [ null, {degrees: 90}]
    ]
  };
  const baseTestAnimation = {
    duration: 750,
    cuePoints: [0, 0.25, 0.5, 0.75, 1],
    keyFrames: _.times(8, () => _.times(3, _.constant(null))),
    oncomplete: () => {
      console.log('override me!  This will display on last');
    }
  };
  const singleTestAnimation = generateMatryoshkaAnimation({
    baseAnimation: _.cloneDeep(baseTestAnimation),
    // .map(_ => _) used here to get Array type from Object type
    targetCollection: allServos.map(a => a),
    animationRunner: continuousTestServos
  });
  const continuousTestAnimation = generateMatryoshkaAnimation({
    baseAnimation: Object.assign(
      _.cloneDeep(baseTestAnimation),
      {
        oncomplete: () =>
          continuousTestServos.enqueue(continuousTestAnimation)
      }
    ),
    // .map(_ => _) used here to get Array type from Object type
    targetCollection: allServos.map(a => a),
    animationRunner: continuousTestServos
  });
  this.repl.inject({
    bot: {
      test: () => stopAndEnqueue(continuousTestServos)(singleTestAnimation),
      continuousTest: () =>
        stopAndEnqueue(continuousTestServos)(continuousTestAnimation),
      stop: () => stopAndEnqueue(continuousTestServos)(resetAnimation)
    },
    allServos,
    continuousTestServos,
    _
  });
  console.log('Try bot.test(), bot.continuousTest(), or bot.stop()');
});
