const utilities = {
  // sortServosByPin(Array[J5Servo]):Array[J5Servo]
  sortServosByPin: (servos) => servos.sort(({pin: pinA}, {pin: pinB}) => pinA < pinB),
  // TODO: Type check for Int in number operations
  sum: (list) => list.reduce((total = 0, next) => total + next),
  average: (list) => utilities.sum(list) / list.length,
  // mid/max/min(Array[J5Servo.range]):Int
  mid: ([min, max]) => (min + max) / 2,
  max: ([min, max]) => max,
  min: ([min, max]) => min
};

module.exports = utilities
