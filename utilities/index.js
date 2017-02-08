const _ = require('lodash');
const utilities = {
  // sortServosByPin(Array[J5Servo]):Array[J5Servo]
  sortServosByPin: (servos) => servos.sort(({pin: pinA}, {pin: pinB}) => pinA < pinB),
  // TODO: Type check for Int in number operations
  sum: (list) => list.reduce((total = 0, next) => total + next),
  average: (list) => utilities.sum(list) / list.length,
  // mid/max/min(Array[J5Servo.range]):Int
  mid: ([min, max]) => (min + max) / 2,
  max: ([min, max]) => max,
  min: ([min, max]) => min,
  stopAndEnqueue: _.curry((animationRunner, animation) => {
    animationRunner.stop();
    animationRunner.enqueue(animation);
  }),
  // generateLinkedAnimationJSObj({Array[J5Servo], J5AnimationInstance, J5Segment}):J5Segment
  generateLinkedAnimationJSObj: ({
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
        return animation;  // This is the root of the object tree.
      } else {
        return _.set(
          _.cloneDeep(animation),
          'oncomplete',
          () => animationRunner.enqueue(accum)
        );
      }
    })
};
module.exports = utilities;
