## Test Programs for Custom Quad-Spider Bot using Node + Johnny-Five
Located in this repo are a series of hastily thrown together programs to test functionality attached to a custom-made quad-spider bot.


### Setup
#### Automated:

1. Run `sh run.sh` and follow prompts to provision dev machine.
1. Run `node test-servos.js` or `node test-servos-with-animation-lib.js` or `node walk-cycle.js`.

(Installer only works on OSX for now)

#### Manual:

1. Install [CH340 drivers](http://blog.sengotta.net/signed-mac-os-driver-for-winchiphead-ch340-serial-bridge/) onto your machine (OSX link).
1. Run `npm install` to install dependencies.
1. Hook up Arduino-bot to your computer via USB.
1. Run `node test-servos.js` or `node test-servos-with-animation-lib.js` or

### Running programs
- When running `node test-dancing-with-J5-lib.js`, you can pass in configurable values like so:

  ```
  // Trying to sync up robot with 160 BPM song
  BPM = 1000 / (160 / 60);
  bot.dance(danceMoves, BPM);
  ```

  You can calculate beats per minute manually using [this website](http://www.beatsperminuteonline.com/) to tap a button every beat.  It's very easy to use!

#### Robot Specs && Robot Buy Guide

Some things every robot needs (like servos for legs), some things can be shared between robots (e.g. LiPo battery charger, or voltage checker).

Each robot costs $70 to buy all parts, though again you can share parts when building > 1 bots.

- [3D printed quad "spider" frame from thingiverse](http://www.thingiverse.com/thing:272233)

    Print instructions: scale everything up to 102%, as that seems to reduce frame breakage over time.

- Superglue

    [Super glue](http://amzn.to/2rDoK7a) ($4-$8)

- 8 servos, 4 attached to the body and 4 to serve as joint mechanisms.

    I recommend [SG90 Micro Servos](http://amzn.to/2rkZaUA) ($20 for 10).  They come with little screws, which will be used to attach servos to 3D printed frame.

- Microcontroller supported by Johnny-Five library

    I recommend [Arduino Nano x5 set](http://amzn.to/2rDc8wS) ($20-$25 for 5) however check [Johnny-Five Platform Support](http://johnny-five.io/platform-support/) if you'd like to deviate!

- Extended USB Cable

    I recommend [6ft USB to Mini B cable](http://amzn.to/2qSUeEX) ($6)

- Breadboard

    I recommend [10 x 400 tie Breadboard](http://amzn.to/2qSLSx8) ($15 for 10)

- Wires of various sizes

    Each servo requires 3 wires (ground wire, 5V power wire, logic wire), and you'll want other wires to make the circuit look nicer.  Arduino requires 7V-12V power in (can be connected directly to 2C LiPo battery)

    I recommend [Hook-Up Wire Kit](http://amzn.to/2rDoODV) ($20) for advanced "cut my OWN wires!" types.

- 7.4V LiPo Battery

    I recommend [1000mAh 2S 20C Lipo](http://amzn.to/2rl4kjE) ($15)

- LiPo Battery Voltage Detector

    I recommend [Monitor Voltage Detector with Loud Beeping Sound](http://amzn.to/2qZWvga) ($5-$6)

- LiPo Battery Charger

    I recommend [2s-3s 7.4v 11.1v Lipo Battery Balancer Charger](http://amzn.to/2qjWjY7) ($10)

- Voltage Regulator components

    These are used to reduce the voltage from a 2 cell LiPo battery to a nice, cool 5V that the micro servos expect.

    I recommend [L7805CV Voltage Regulator](http://amzn.to/2qSQymD) ($5-$7 for 5).  It takes in 7V-25V and outputs 5V!

- (optional) 7V-12V in 3.3V out converter(s)
- (optional) 3.3V or 5V sensors

    If you get a 3.3V sensor, you need a 3.3V voltage regulator!

- Driver to interact with Arduino of choice

    I built the serious of robots after Arduino Nano, which require CH340 drivers (included in this repo).  If you choose another microcontroller platform, please research drivers and install them to your machine.

- Knowledge of specs to put together bot

  TODO: Create circuit graph of robot

- Flash Arduino to work with node + Johnny-Five library
- Create program, do things!
