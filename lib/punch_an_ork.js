'use strict';

const readlineSync = require('readline-sync');
const ROLES = require('./roles.js');
const PLAYER_UNIT = require('./playerUnit');

let computer = ROLES['boy(fighter)'];

class PunchAnOrkApp {
  constructor() {
    this.playerLeader = PLAYER_UNIT.leader;
    this.playerUnits =  PLAYER_UNIT.units;
  }

  currentUnit() {
    return this.playerUnits[0];
  }

  removeUnit() {
    this.playerUnits.shift();
  }

  unitLength() {
    return this.playerUnits.length;
  }

}

class PunchAnOrkBattle extends PunchAnOrkApp {
  constructor(computer) {
    super();
    this.playerUnit = super.currentUnit();
    this.playerUnitWounds = this.playerUnit.stats.wounds;
    this.computer = computer;
    this.playerUnitHand = [];
    this.computerHand = [];
    this.playerUnitWeaponSkill = this.playerUnit.weapons.weapon_skill;
    this.computerWeaponSkill = this.computer.weapons.weapon_skill;
  };

  pause(message = '') {
    let pause = readlineSync.question(`${message}`);
  }

  rollD6() {
    return Math.ceil(Math.random() * 6);
  }

  deployUnit() {
    this.playerUnit = super.currentUnit();
  }

  initializeHands() {
    this.playerUnitHand = this.createHand(this.playerUnit);
    this.computerHand = this.createHand(this.computer);
  }

  createHand(playerUnit) {
    return 'x'.repeat(playerUnit.weapons.attacks).split('').map(_element => this.rollD6());
  }

  diceImageHand(hand) {
    return hand.map(element => String.fromCharCode(9855 + element)).join(' ');
  }

  displayInitialHands() {
    console.log(`Your Roll: ${this.diceImageHand(this.playerUnitHand)}`);
    console.log(`Your Weapon Skill: ${this.playerUnitWeaponSkill}+`);
    console.log('');
    console.log(`The Ork's Roll: ${this.diceImageHand(this.computerHand)}`);
    console.log(`The Ork's Weapon Skill: ${this.computerWeaponSkill}+`);
    console.log('');
    console.log('Units: ' + "👤".repeat(super.unitLength()));
    console.log('');
    console.log(`Unit Health: ${this.playerUnitWounds}`);
    console.log(`Ork's Health: ${this.computer.stats.wounds}`);

    
  }

  displayDiscardedHands() {
    console.log(`With Failed Dice Removed, Your Roll: ${this.diceImageHand(this.playerUnitHand)}`);
    console.log(`Your Weapon Skill: ${this.playerUnitWeaponSkill}+`);
    console.log('');
    console.log(`With Failed Dice Removed, The Ork's Roll: ${this.diceImageHand(this.computerHand)}`);
    console.log(`The Ork's Weapon Skill: ${this.computerWeaponSkill}+`);
    console.log('');
  }

  displayMostCurrentHands() {
    console.log(`Your Current Dice Pool: ${this.diceImageHand(this.playerUnitHand)}`);
    console.log('');
    console.log(`The Ork's Current Dice Pool: ${this.diceImageHand(this.computerHand)}`);
    console.log('');
    console.log('Units: ' + "👤".repeat(super.unitLength()));
    console.log('');
    console.log(`Unit Health: ${this.playerUnitWounds}`);
    console.log(`Ork's Health: ${this.computer.stats.wounds}`);


  }

  removeFailedDice() {
    this.playerUnitHand = this.failedDiceFilter(this.playerUnitHand, this.playerUnitWeaponSkill);
    this.computerHand = this.failedDiceFilter(this.computerHand, this.computerWeaponSkill);
  }

  failedDiceFilter(dice, weapon_skill) {
    return dice.filter(element => element >= weapon_skill);
  }

  choosePlayerDice() {
    let chosenDice = readlineSync.question('Choose a Dice.');

    while (!this.playerUnitHand.includes(+chosenDice)) {
      chosenDice = readlineSync.question('Invalid Selection. Choose a Dice.');
    }

    //chosen dice is removed from the hand
    this.removeDiceFromHand(this.playerUnitHand, chosenDice);

    return chosenDice;
  }

  removeDiceFromHand(hand, dice) {
    hand.splice(hand.indexOf(+dice), 1);
  }

  findNonSix(hand) {
    return hand.find(element => element !== '6');
  }

  playerAction(chosenDice) {
    let diceAction = readlineSync.question('Attack, Parry, or Run?');
        
    while (diceAction !== 'Attack' && diceAction !== 'Parry' && diceAction !== 'Run') {
      diceAction = readlineSync.question('Invalid Action. Attack, Parry, or Run?');
    } 

    //playerUnit carries out the chosen action
    if (diceAction === 'Attack') {
      this.playerUnitAttack(chosenDice);
    } else if (diceAction === 'Parry') {
      this.playerUnitParry(chosenDice);
    } 

    return diceAction;
  }

  playerUnitAttack(chosenDice) {
    if (chosenDice === '6') {
      console.log(`You've crit the Ork for ${this.playerUnit.weapons.damage.critical} damage`);
      this.pause();
      this.computer.stats.wounds -= this.playerUnit.weapons.damage.critical;
      this.computer.stats.wounds = this.computer.stats.wounds < 0 ? 0 : this.computer.stats.wounds;
      console.log(`The Ork's Health: ${this.computer.stats.wounds}`);
      this.pause();
    } else {
      console.log(`You've hit the Ork for ${this.playerUnit.weapons.damage.regular} damage`);
      this.pause();
      this.computer.stats.wounds -= this.playerUnit.weapons.damage.regular;
      this.computer.stats.wounds = this.computer.stats.wounds < 0 ? 0 : this.computer.stats.wounds;
      console.log(`The Ork's Health: ${ this.computer.stats.wounds}`);
      this.pause();
    }
  }

  playerUnitParry(chosenDice) {
    if (chosenDice === '6') {
      let parriedDice = readlineSync.question("Choose One of the Ork's Dice.");
      while (!this.computerHand.includes(+parriedDice)) {
        parriedDice = readlineSync.question("Invalid Selection. Choose One of the Ork's Dice.");
      }
      this.removeDiceFromHand(this.computerHand, parriedDice);
      console.log(`You've removed a ${parriedDice} from the Ork's dice pool!`);
      this.pause("");
    } else {
      this.removeDiceFromHand(this.computerHand, this.findNonSix(this.computerHand));
      console.log(`You've removed a regular hit from the Ork's dice pool!`);
      this.pause("");
    }
  }

  computerAction() {
    if ((this.playerUnitWounds <= this.computer.weapons.damage.critical) || 
    (this.computer.stats.wounds > this.playerUnit.weapons.damage.critical) || 
    (this.playerUnitHand.length === 0)) {
      if (this.computerHand.includes(6)) {
        this.removeDiceFromHand(this.computerHand, 6);
        console.log(`The Ork chose to attack and has crit you for ${this.computer.weapons.damage.critical} damage!`);
        this.pause("");
        this.playerUnitWounds -= this.computer.weapons.damage.critical;
        this.playerUnitWounds = this.playerUnitWounds < 0 ? 0 : this.playerUnitWounds;       
        console.log(`Unit Health: ${this.playerUnitWounds}`);
        this.pause("");
      } else {
        this.removeDiceFromHand(this.computerHand, this.findNonSix(this.computerHand));       
        console.log(`The Ork chose to attack and has hit you for ${this.computer.weapons.damage.regular} damage!`);
        this.pause("");
        this.playerUnitWounds -= this.computer.weapons.damage.regular;
        this.playerUnitWounds = this.playerUnitWounds < 0 ? 0 : this.playerUnitWounds;          
        console.log(`Unit Health: ${this.playerUnitWounds}`);
        this.pause("");
      }
    } else {
      let diceToParry;
      let parriedDice;
      
      if (this.computer.stats.wounds === this.playerUnit.weapons.damage.critical && this.playerUnitHand.includes('6') && this.computerHand.includes('6')) {
        diceToParry = '6';
        parriedDice = '6';
      } else {
        diceToParry = this.findNonSix(this.computerHand);
        parriedDice = this.findNonSix(this.playerUnitHand);
      }

      this.removeDiceFromHand(this.computerHand, diceToParry);
      this.removeDiceFromHand(this.playerUnitHand, parriedDice);
      console.log(`The Ork parried removing a ${parriedDice} from your dice pool using a ${diceToParry}!`);
      this.pause("");
    }
  }

  isComputerDead() {
    return this.computer.stats.wounds <= 0;
  }

  isPlayerUnitDead() {
    return this.playerUnitWounds <= 0;
  }
}

function game() { 
  let currentSession = new PunchAnOrkApp();
  console.clear();
  let pause = readlineSync.question("Welcome ta Punch n' Ork!");
  let anotherRound = 'y';

  while (currentSession.unitLength() > 0) {
    let currentGame = new PunchAnOrkBattle(computer);

    console.clear();
    currentGame.pause("You send one unit to battle.");
    currentGame.deployUnit();

    while (anotherRound === 'y' && currentGame.computer.stats.wounds > 0) {
      console.clear();

      //create initial playerUnit and computer hand; display both initial hands
      currentGame.initializeHands();
      currentGame.displayInitialHands();

      //discard failed dice; display discarded hands
      currentGame.removeFailedDice();
      currentGame.pause("");
      
      console.clear();
      currentGame.displayDiscardedHands();
      currentGame.pause("");

      //establish loop dependent on playerUnit death
      while (currentGame.playerUnitWounds > 0) {
        
        console.clear();
        currentGame.displayMostCurrentHands()
        currentGame.pause("");

        //playerUnit selects di and action only if playerUnit hand includes any dice
        if (currentGame.playerUnitHand.length > 0) {
    
          //playerUnit chooses a di; di selection is validated
          let chosenDice = currentGame.choosePlayerDice();

          //playerUnit action is chosen and validated
          let diceAction = currentGame.playerAction(chosenDice);
          if (diceAction === 'Run') {
            anotherRound = 'n';
            break;
          }
        }

        //determine if computer is dead
        if (currentGame.isComputerDead()) {
          anotherRound = 'n';
          break;
        }

        console.clear();
        currentGame.displayMostCurrentHands()
        currentGame.pause("");

        //computer acts
        if (currentGame.computerHand.length > 0) {
          currentGame.computerAction();
        }

        //determine if playerUnit is dead
        if (currentGame.isPlayerUnitDead()) {
          anotherRound = 'n';
          break;
        }

        //if both hands are empty prompt the player if they want to go another round
        if (currentGame.computerHand.length === 0 && currentGame.playerUnitHand.length === 0) {
          console.log(`Unit Health: ${currentGame.playerUnitWounds}`);
          console.log(`Ork's Health: ${currentGame.computer.stats.wounds}`);

          anotherRound = readlineSync.question("Do you want to go another round? (y / n)");

          while (anotherRound !== 'y' && anotherRound !== 'n') {
            anotherRound = readlineSync.question("What 'r you waiting for!? Do you want to go another round? (y / n)");
          }
          break;
        }
      }
    }

    //report results of battle (in the future, this would report win or loss to player, etc.)
    if (!currentGame.isPlayerUnitDead() && !currentGame.isComputerDead()) {
      currentGame.pause("You Ran Coward!");
      break;
    } else if (currentGame.isPlayerUnitDead()) {
      currentGame.pause("You Lost a Unit!");
      currentSession.removeUnit();

      if (currentSession.unitLength() > 0) {
        anotherRound = readlineSync.question("Do you want to send another to battle? (y / n)");
        while (anotherRound !== 'y' && anotherRound !== 'n') {
          anotherRound = readlineSync.question("What 'r you waiting for!? Do you want to go another round? (y / n)");
        }
        if (anotherRound === 'n') break;
      } else console.log('Your unit has been decimated..');
    } else {
      console.log('You Beat Ork!');
      break;
    }
  }
}

game();


