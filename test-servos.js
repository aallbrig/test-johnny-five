const five = require("johnny-five");
const _ = require("lodash");
const board = new five.Board();
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
const average = (a) => a.reduce((prev, next) => prev + next, 0) / a.length;
const loggedAverage = (a) => {
  const result = average(a);
  console.log(`result: ${result}`);
  return result;
};
const sortServosByPin =
  (servos) => servos.sort((a, b) => a.pin > b.pin).reverse();
const servoTest = _.curry((time, servos) => {
  servos.forEach((servo, index) => {
    const {range} = servo;
    const [min, max] = range;
    const currentFrame = (2 * time + 50) * index;
    setTimeout(() => servo.to(min), currentFrame);
    setTimeout(() => servo.to(max), currentFrame + time);
    setTimeout(() => servo.to(average([min, max])), currentFrame + (2 * time));
  });
});
const fastServoTest = servoTest(150);
const slowServoTest = servoTest(300);
function continuousServoTest (servos) {
  const time = 200;
  const doubleTime = 2 * time;
  const intervalTime = servos.length * doubleTime;
  servoTest(time)(servos);  // immediate action
  return setInterval(() => servoTest(time)(servos), intervalTime);  // ∞
}

board.on("ready", function () {
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
  const allServos = sortServosByPin([...legServos, ...bodyServos]);
  this.repl.inject({
    legServos,
    bodyServos,
    allServos,
    servoTest: () => fastServoTest(allServos),
    continuousServoTest: () => continuousServoTest(allServos)
  });
  console.log('Try servoTest() or continuousServoTest() .');
});
