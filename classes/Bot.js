const _ = require('lodash');
const {
  generateLinkedAnimationJSObj,
  stopAndEnqueue,
  mid
} = require('../utilities');

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
  /*  constructor({
        animationRunner:J5AnimationInstance,
        (optional) danceMoves:Array[Func]
        (optional) allServos:Array[J5Servo],
        (optional) danceTiming:Millis,
      }):Bot
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
    this.currentAnimationTimers = [];  // TODO: Get Stop Working
  }
  test() {
    return stopAndEnqueue(this.botAnimationRunner)(singleTestAnimation(this.allServos, this.botAnimationRunner))
  }
  stop() {
    return stopAndEnqueue(this.botAnimationRunner)(resetAnimation)
  }
  // Single Move Functions
  // Uncomment scaffolding below when creating new move functions!
  // Name Schema: (R"ight" || L"eft") + (B"ack" || F"ront") + (B"ody" || L"eg")
  //   e.g. LBL == "Left Back Leg"
  // const [
  //   LBL, LBB, LFB, LFL,
  //   //Leg          Leg
  //   //   Body Body        <-- The front
  //   //   Body Body        <-- of Robot
  //   //Leg          Leg
  //   RBL, RBB, RFB, RFL
  // ] = this.allServos.map(a => a);
  turnRight(timing = 135) {
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
  expandBackLegs(toValue = 100) {
    const [
      LBL, LBB, LFB, LFL,
      RBL, RBB, RFB, RFL
    ] = this.allServos.map(a => a);
    return [LBL, RBL].map(servo => servo.to(toValue, 250));
  }
  straightenUp(timing = 250) {
    return this.allServos.map(servo => servo.to(servo.startAt, timing));
  }
  backLegsBehindBody(timing = 250) {
    const [
      LBL, LBB, LFB, LFL,
      RBL, RBB, RFB, RFL
    ] = this.allServos.map(a => a);
    return [
      ...[LBB].map(servo => servo.to(servo.range[1], timing)),
      ...[RBB].map(servo => servo.to(servo.range[0], timing))
    ];
  }
  frontLegsInFrontOfBody(timing = 250) {
    const [
      LBL, LBB, LFB, LFL,
      RBL, RBB, RFB, RFL
    ] = this.allServos.map(a => a);
    return [
      ...[LFB].map(servo => {
        const [min, max] = servo.range;
        const middle = mid(servo.range);
        const oneFifthValue = max / 5;
        servo.to(middle - oneFifthValue, timing);
      }),
      ...[RFB].map(servo => {
        const [min, max] = servo.range;
        const middle = mid(servo.range);
        const aFractionOfMax = max / 8;
        servo.to(middle + aFractionOfMax, timing);
      }),
    ];
  }
  // Dancing
  dance() {
    const danceMoves = _.get(this, 'danceMoves', []);
    const danceTimers = danceMoves.map((moveFn, index) =>
      setTimeout(
        moveFn.bind(this, this.danceTiming),
        index * this.danceTiming
      )
    );
    return danceTimers;
  }
  d() {
    this.dance();
  }
  continuousDance() {
    const currentAnimationTimers = this.currentAnimationTimers;
    const danceLength = this.danceMoves.length;
    const intervalTime = this.danceTiming * danceLength;
    const continuousDance = [
      ...this.dance(),
      setInterval(
        () => this.dance(),
        intervalTime
      )
    ];
    // TODO: Below timer implementation is broken.  Fix!
    // this.currentAnimationTimers = [..._.clone(currentAnimationTimers), ..._.clone(continuousDance)].filter(v => !!v);
    return 'Continuous Dance Initialized';
  }
  c() {
    this.continuousDance();
  }
  stop() {
    const { currentAnimationTimers } = this;
    this.currentAnimationTimers = currentAnimationTimers
      .filter(v => !!v)
      .map(clearInterval)
      .filter(v => !!v);
    // TODO: Below Message is lying.  Fix this functionality!
    return 'Not Implemented yet.  You\'re going to have to push the kill switch!  Hurry, before it becomes self aware!';
  }
}

module.exports = Bot;
