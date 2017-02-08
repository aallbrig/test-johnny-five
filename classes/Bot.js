const _ = require('lodash');
const { generateLinkedAnimationJSObj, stopAndEnqueue } = require('../utilities');

const baseTestAnimation = {
  duration: 500,
  cuePoints: [0, 0.25, 0.5, 0.75, 1],
  keyFrames: _.times(8, () => _.times(3, _.constant(null))),
  oncomplete: () => console.log('override me!  This will display on last')
};
const resetAnimation = {
  duration: 3000,  // more time means greater dramatic effect
  keyFrames: _.times(8, _.constant([null, {degrees: 90}]))
};
const singleTestAnimation = (allServos, botAnimationRunner) => generateLinkedAnimationJSObj({
  baseAnimation: _.cloneDeep(baseTestAnimation),
  // .map(_ => _) used here to get Array type from Object type
  targetCollection: allServos.map(a => a),
  animationRunner: botAnimationRunner
});

class Bot {
  /*
    {
    animationRunner:J5AnimationInstance,
    danceMoves:Array[Func]
    allServos:Array[J5Servo],
    danceTiming:Millis,
    }
  */
  constructor({
    animationRunner, danceMoves = [], allServos = [], danceTiming = 500
  }) {
    this.allServos = allServos;
    this.bodyServos = allServos.map(a => a).filter(({type}) => type == 'body');
    this.legServos = allServos.map(a => a).filter(({type}) => type == 'leg');
    this.bodyServos = this.allServos.map(a => a);
    this.botAnimationRunner = animationRunner;
    this.danceTiming = danceTiming;
  }
  test() {
    return stopAndEnqueue(this.botAnimationRunner)(singleTestAnimation(this.allServos, this.botAnimationRunner))
  }
  stop() {
    return stopAndEnqueue(this.botAnimationRunner)(resetAnimation)
  }
  // Single Moves
  turnRight(timing = 135) {
    // Name Schema: (R"ight" || L"eft") + (B"ack" || F"ront") + (B"ody" || L"eg")
    //   e.g. LBL == "Left Back Leg"
    const [
      LBL, LBB, LFB, LFL,
      RBL, RBB, RFB, RFL
    ] = this.allServos.map(a => a);
    return [
      ...this.bodyServos.map(servo => servo.to(servo.range[1], timing)),
      ...[RFL].map(servo => servo.to(120, timing)),
      ...[LFL].map(servo => servo.to(140, timing))
    ];
  }
  turnLeft(timing = 135) {
    const [
      LBL, LBB, LFB, LFL,
      RBL, RBB, RFB, RFL
    ] = this.allServos.map(a => a);
    return [
      ...this.bodyServos.map(servo => servo.to(servo.range[0], timing)),
      ...[RFL].map(servo => servo.to(140, timing)),
      ...[LFL].map(servo => servo.to(120, timing))
    ];
  }
  expandFrontLegs(toValue = 100) {
    const [
      LBL, LBB, LFB, LFL,
      RBL, RBB, RFB, RFL
    ] = this.allServos.map(a => a);
    return [LFL, RFL].map(servo => servo.to(toValue, 250));
  }
  straightenUp() {
    return this.allServos.map(servo => servo.to(servo.startAt, 250));
  }
  // Dancing
  dance() {
    return this.danceMoves.map((moveFn, index) =>
      setTimeout(
        moveFn.bind(this, this.danceTiming),
        index * this.danceTiming
      )
    );
  }
  continuousDance() {
    const danceLength = this.danceMoves.length;
    const intervalTime = this.danceTiming * danceLength;
    return [
      ...this.dance(this.danceMoves, this.danceTiming),
      setInterval(
        this.dance.bind(this, this.danceMoves, this.danceTiming),
        intervalTime
      )
    ];
  }
}

module.exports = Bot;
