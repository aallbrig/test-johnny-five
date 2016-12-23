const five = require('johnny-five');
const _ = require('lodash');
const utils = require('./utilities');
const board = new five.Board();
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
const servoTest = _.curry((time, servos) =>
  servos.forEach((servo, index) => {
    const {range} = servo;
    const [min, max] = range;
    const currentFrame = (2 * time + 50) * index;
    setTimeout(() => servo.to(min), currentFrame);
    setTimeout(() => servo.to(max), currentFrame + time);
    setTimeout(() => servo.to(utils.average([min, max])), currentFrame + (2 * time));
  })
);
const fastServoTest = servoTest(150);
const slowServoTest = servoTest(300);
const continuousServoTest = (servos, time = 200) => {
  const doubleTime = 2 * time;
  const intervalTime = servos.length * doubleTime;
  const customServoTest = servoTest(time);
  customServoTest(servos);  // immediate action
  return setInterval(() => customServoTest(servos), intervalTime);  // ∞
}

board.on('ready', function () {
  const legServos = legServoPins.map(pin => new five.Servo({
    pin,
    range: [0, 180],
    startAt: 90
  }));
  const bodyServos = bodyServoPins.map(pin => new five.Servo({
    pin,
    range: [45, 135],
    startAt: 90
  }));
  const allServos = utils.sortServosByPin([...legServos, ...bodyServos]);
  this.repl.inject({
    legServos,
    bodyServos,
    allServos,
    servoTest: () => fastServoTest(allServos),
    continuousServoTest: () => continuousServoTest(allServos),
    stopContinous: clearInterval
  });
  console.log('Try servoTest() or continuousServoTest() .');
  console.log('Stop continuous test via stopContinous(fnId)');
});
