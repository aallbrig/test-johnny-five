const five = require("johnny-five");
const _ = require("lodash");
const board = new five.Board();
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
const servoTest = _.curry((time, servos) => {
  servos.forEach((servo, index) => {
    const [min, max] = servo.range;
    setTimeout(() => {
      servo.to(min);
      setTimeout(() => {
        servo.to(max);
        setTimeout(() => {
          servo.to((min + max) / 2);
        }, time);
      }, time);
    }, ((time * 2) + 50) * index)
  });
});
const fastServoTest = servoTest(150);
const slowServoTest = servoTest(300);
function continuousServoTest (servos) {
  const time = 200;
  const doubleTime = (time * 2) + 50;
  servoTest(time)(servos);
  return setInterval(() => {
    servoTest(time)(servos);
  }, (servos.length * doubleTime));
}

board.on("ready", function () {
  const legServos = legServoPins.map((pin) =>
    new five.Servo({
      pin,
      range: [0, 180],
      startAt: 90
    })
  );
  const bodyServos = bodyServoPins.map(pin =>
    new five.Servo({
      pin,
      range: [45, 135],
      startAt: 90
    })
  );
  const allServos = [...legServos, ...bodyServos].sort((a, b) => a.pin > b.pin).reverse();
  this.repl.inject({
    legServos,
    bodyServos,
    allServos,
    servoTest: () => fastServoTest(allServos),
    continuousServoTest: () => continuousServoTest(allServos)
  });
});
