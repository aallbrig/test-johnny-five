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
- When running `node test-servos-with-animation-lib.js`, you can pass in configurable values like so:

  ```
  // Trying to sync up robot with 160 BPM song
  BPM = 1000 / (160 / 60);
  bot.dance(danceMoves, BPM);
  ```

#### Robot Specs
TODO

#### Robot Buy Guide
TODO
