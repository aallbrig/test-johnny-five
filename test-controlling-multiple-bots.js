const five = require('johnny-five');
const _ = require('lodash');
const { sortServosByPin } = require('./utilities');
const Bot = require('./classes/Bot');
const legServoPins = [12,       9, 8,     5];
const bodyServoPins = [  11, 10,     7, 6];
const beatsPerMinute = 114;
const DANCE_TIMING = (1000 / (beatsPerMinute / 60)) / 2;
const BOARD_A_ID = 'A';
const BOARD_B_ID = 'B';
const boards = new five.Boards([BOARD_A_ID, BOARD_B_ID]);
const dances = (bot) => (_.shuffle([
  bot.turnRight,
  bot.straightenUp,
  bot.turnLeft,
  bot.straightenUp,

  () => {},
  () => {},
  () => {},
  () => {},

  bot.expandFrontLegs,
  bot.straightenUp,
  bot.expandFrontLegs,
  bot.straightenUp,

  () => {},
  () => {},
  () => {},
  () => {},

  bot.backLegsBehindBody,
  bot.straightenUp,
  bot.backLegsBehindBody,
  bot.straightenUp,

  () => {},
  () => {},
  () => {},
  () => {},

  bot.backLegsBehindBody,
  bot.straightenUp,
  bot.frontLegsInFrontOfBody,
  bot.straightenUp,

  bot.frontLegsInFrontOfBody,
  () => bot.expandFrontLegs(150),
  () => {
    bot.backLegsBehindBody();
    bot.expandFrontLegs();
  },
  bot.straightenUp,

  bot.expandFrontLegs,
  () => {},
  bot.expandBackLegs,
  bot.straightenUp,

  () => {},
  () => {},
  () => {},
  () => {},

  bot.frontLegsInFrontOfBody,
  bot.straightenUp,
  () => {
    bot.frontLegsInFrontOfBody(),
    bot.expandFrontLegs();
  },
  bot.straightenUp,

  () => {},
  () => {},
  () => {},
  () => {},

  () => bot.expandLeftLegs(140),
  () => bot.expandRightLegs(140),
  () => bot.expandLeftLegs(90),
  () => bot.expandRightLegs(90),

  () => {},
  () => {},
  () => {},
  () => {},

  () => {
    bot.expandLeftLegs(30);
    bot.expandRightLegs(30);
  },
  () => {
    bot.expandLeftLegs(150);
    bot.expandRightLegs(150);
  },
  () => {
    bot.expandLeftLegs(30);
    bot.expandRightLegs(30);
  },
  bot.straightenUp
]));
boards.on('ready', function() {
  let botA, botB;
  this.each((board) => {
    const allServos = new five.Servos(sortServosByPin([
      ...legServoPins.map(pin => ({pin, range: [25, 180], startAt: 90, type: 'leg', board})),
      ...bodyServoPins.map(pin => ({pin, range: [45, 135], startAt: 90, type: 'body', board}))
    ]));
    if (board.id === BOARD_A_ID) {
      botA = new Bot({
        allServos,
        animationRunner: new five.Animation(allServos),
        danceTiming: DANCE_TIMING
      });
      botA.danceMoves = dances(botA);
    } else if (board.id === BOARD_B_ID) {
      botB = new Bot({
        allServos,
        animationRunner: new five.Animation(allServos),
        danceTiming: DANCE_TIMING
      });
      botB.danceMoves = dances(botB);
    }
  });
  const bots = [botA, botB];
  bots.map(bot => bot.d());
  this.repl.inject({
    botA,
    botB,
    bots
  });
});
