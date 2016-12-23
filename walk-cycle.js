const five = require('johnny-five');
const _ = require('lodash');
const utils = require('./utilities');
const board = new five.Board();
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
const walkCycle = (allServos, timing = 3000) => {
  // Take advantage of known pin hookups.  NOTE: brittle code (kinda)!
  // Name Schema: (R"ight" || L"eft") + (B"ack" || F"ront") + (B"ody" || L"eg")
  //   e.g. LBL == "Left Back Leg"
  // const [min, max] = servo.range;
  //   meaning servo.range[0] === min, servo.range[1] === max
  const [
    LBL, LBB, LFB, LFL,
    RBL, RBB, RFB, RFL
  ] = allServos;  //  <-- Known pin hookups aka the "brittle"
  // TODO: Redo "stateA", "stateB" logic using johnny5's animation lib
  const stateA = () => {
    // body
    LBB.to(utils.min(LBB.range), timing);
    LFB.to(utils.max(LFB.range), timing);
    RBB.to(utils.min(RBB.range), timing);
    RFB.to(utils.max(RFB.range), timing);
    // legs
    LBL.to(utils.max(LBL.range));
    LFL.to(utils.mid(LFL.range));
    RBL.to(utils.mid(RBL.range));
    RFL.to(utils.max(RFL.range));
  }
  const stateB = () => {
    // body
    LBB.to(utils.max(LBB.range), timing);
    LFB.to(utils.min(LFB.range), timing);
    RBB.to(utils.max(RBB.range), timing);
    RFB.to(utils.min(RFB.range), timing);
    // legs
    LBL.to(utils.mid(LBL.range));
    LFL.to(utils.max(LFL.range));
    RBL.to(utils.max(RBL.range));
    RFL.to(utils.mid(RFL.range));
  }
  stateB();  // initial state
  return setInterval(() => {
    stateA();
    setTimeout(() => stateB(), timing);
  }, timing * 2);
}

board.on('ready', function () {
  const legServos = legServoPins.map(pin => new five.Servo({
    pin,
    range: [30, 135],
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
    walkCycle: () => walkCycle(allServos),
    stopContinous: clearInterval
  });
  console.log('Execute walkCycle() to begin sequence.');
  console.log('Stop continuous test via stopContinous(fnId)');
});
