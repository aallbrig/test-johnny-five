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

#### Robot Specs
TODO: Add links to these items
- 3D printed quad "spider" frame from thingiverse (http://www.thingiverse.com/thing:272233)
- 8 servos, 4 attached to the body and 4 to serve as joint mechanisms.
- Breadboard or custom made circuit board
- Wires
- 7V-12V in 5V out converter(s)
- (optional) 7V-12V in 3.3V out converter(s)
- (optional) 3.3V or 5V sensors
- Driver to interact with Arduino of choice
- Knowledge of specs to put together bot

  TODO: Create circuit graph of robot
- Flash Arduino to work with node + Johnny-Five library
- Create program, do things

#### Robot Buy Guide
TODO
