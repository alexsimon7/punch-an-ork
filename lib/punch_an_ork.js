'use strict';

const readlineSync = require('readline-sync');
const ROLES = require('./roles.js');

let player = ROLES['guardsmen(trooper)'];
let computer = ROLES['boy(fighter)'];

class PunchAnOrk {
  constructor(player, computer) {
    this.player = player;
    this.computer = computer
    this.playerHand = [];
    this.computerHand = [];
    this.playerWeaponSkill = this.player.weapons.weapon_skill;
    this.computerWeaponSkill = this.computer.weapons.weapon_skill;

  };

  pause(message = '') {
    let pause = readlineSync.question(`${message}`);
  }

  rollD6() {
    return Math.ceil(Math.random() * 6);
  }

  createHand(player) {
    return 'x'.repeat(player.weapons.attacks).split('').map(_element => this.rollD6());
  }

  diceImageHand(hand) {
    return hand.map(element => String.fromCharCode(9855 + element)).join(' ');
  }

  displayInitialHands() {
    console.log(`Your Roll: ${this.diceImageHand(this.playerHand)}`);
    console.log(`Your Weapon Skill: ${this.playerWeaponSkill}+`);
    console.log('');
    console.log(`The Ork's Roll: ${this.diceImageHand(this.computerHand)}`);
    console.log(`The Ork's Weapon Skill: ${this.computerWeaponSkill}+`);
  }

  displayDiscardedHands() {
    console.log(`With Failed Dice Removed, Your Roll: ${this.diceImageHand(this.playerHand)}`);
    console.log(`Your Weapon Skill: ${this.playerWeaponSkill}+`);
    console.log('');
    console.log(`With Failed Dice Removed, The Ork's Roll: ${this.diceImageHand(this.computerHand)}`);
    console.log(`The Ork's Weapon Skill: ${this.computerWeaponSkill}+`);
    console.log('');
  }

  displayMostCurrentHands() {
    console.log(`Your Current Dice Pool: ${this.diceImageHand(this.playerHand)}`);
    console.log('');
    console.log(`The Ork's Current Dice Pool: ${this.diceImageHand(this.computerHand)}`);
  }

  discardFailedDice(dice, weapon_skill) {
    return dice.filter(element => element >= weapon_skill);
  }

  removeDiceFromHand(hand, dice) {
    hand.splice(hand.indexOf(+dice), 1);
  }

  findNonSix(hand) {
    return hand.find(element => element !== '6');
  }

  playerAttack(chosenDice) {
    if (chosenDice === '6') {
      console.log(`You've crit the Ork for ${this.player.weapons.damage.critical} damage`);
      this.pause();
      this.computer.stats.wounds -= this.player.weapons.damage.critical;
      console.log(`The Ork's Health: ${this.computer.stats.wounds}`); //Fix Negative Health
      this.pause();
    } else {
      console.log(`You've hit the Ork for ${this.player.weapons.damage.regular} damage`);
      this.pause();
      this.computer.stats.wounds -= this.player.weapons.damage.regular;
      console.log(`The Ork's Health: ${ this.computer.stats.wounds}`); //Fix Negative Health
      this.pause();
    }
  }

  playerParry(chosenDice) {
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
    if ((this.player.stats.wounds <= this.computer.weapons.damage.critical) || 
    (this.computer.stats.wounds > this.player.weapons.damage.critical) || 
    (this.playerHand.length === 0)) {
      if (this.computerHand.includes(6)) {
        this.removeDiceFromHand(this.computerHand, 6);
        console.log(`The Ork chose to attack and has crit you for ${this.computer.weapons.damage.critical} damage!`);
        this.pause("");
        this.player.stats.wounds -= this.computer.weapons.damage.critical;       
        console.log(`Your Health: ${this.player.stats.wounds}`); //Fix Negative Health
        this.pause("");
      } else {
        this.removeDiceFromHand(this.computerHand, this.findNonSix(this.computerHand));       
        console.log(`The Ork chose to attack and has hit you for ${this.computer.weapons.damage.regular} damage!`);
        this.pause("");
        this.player.stats.wounds -= this.computer.weapons.damage.regular;        
        console.log(`Your Health: ${this.player.stats.wounds}`); //Fix Negative Health
        this.pause("");
      }
    } else {
    console.log('Parry!') //Need to Code Parry for Computer
    }
  }
}

function game() {
  let currentGame = new PunchAnOrk(player, computer);
  let anotherRound = 'y';

  console.clear();
  currentGame.pause("Welcome ta Punch n' Ork!");

      // console.clear();
    // currentGame.pause("Are ya brave enuf ta come to try n punch me?");

    // console.clear();
    // currentGame.pause("Build Out Player Selection.");

    // console.clear();
    // currentGame.pause("Let's Fight!! WAAAAAAARGH!!");

    // console.clear();
    // let playerRollDice = readlineSync.question("You have [will state player attacks] attack dice. Roll? (y / n)");

    // while(playerRollDice !== 'y') {
    //   currentGame.pause("What 'r you waitng for!? Let's Fight!! WAAAAAAARGH!!");
    //   playerRollDice = readlineSync.question("You have [will state player attacks] attack dice. Roll? (y / n)");
    // }

  while (anotherRound === 'y') {

    console.clear();
    
    //create initial player and computer hand; display both initial hands
    
    currentGame.playerHand = currentGame.createHand(currentGame.player);
    currentGame.computerHand = currentGame.createHand(currentGame.computer);
    currentGame.displayInitialHands();

    //discard failed dice; display discarded hands

    currentGame.playerHand = currentGame.discardFailedDice(currentGame.playerHand, currentGame.playerWeaponSkill);
    currentGame.computerHand = currentGame.discardFailedDice(currentGame.computerHand, currentGame.computerWeaponSkill);
    currentGame.pause("");
    
    console.clear();
    currentGame.displayDiscardedHands();
    currentGame.pause("");

    //establish loop dependant on player/computer death
    
    while (currentGame.player.stats.wounds > 0 && currentGame.computer.stats.wounds > 0) {
      
      console.clear();
      currentGame.displayMostCurrentHands()
      currentGame.pause("");

  //player selects dice and action only if player hand includes any dice

      if (currentGame.playerHand.length > 0) {
        
        //player choses a dice; dice selection is validated
        
        let chosenDice = readlineSync.question('Choose a Dice.');

        while (!currentGame.playerHand.includes(+chosenDice)) {
          chosenDice = readlineSync.question('Invalid Selection. Choose a Dice.');
        }

        //chosen dice is removed from the hand
        
        currentGame.removeDiceFromHand(currentGame.playerHand, chosenDice);

        //player action is chosen and validated; **KNOWN ISSUE - Where Ork Only Has Crits and Player Only Has Non-Crits and Attempts to Parry
      
        let diceAction = readlineSync.question('Attack, Parry, or Run?');
    
        while (diceAction !== 'Attack' && diceAction !== 'Parry' && diceAction !== 'Run') {
          diceAction = readlineSync.question('Invalid Action. Attack, Parry, or Run?');
        } 

        //player carries out the chosen action
    
        if (diceAction === 'Attack') {
          currentGame.playerAttack(chosenDice);
        } else if (diceAction === 'Parry') {
          currentGame.playerParry(chosenDice);
        } else if (diceAction === 'Run') {
          anotherRound = 'n';
          console.log(`You run away!`);
          break
        }
      }

      //determine if computer is dead

      if (currentGame.computer.stats.wounds <= 0) {
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

      //determine if player is dead


      if (currentGame.player.stats.wounds <= 0) {
        anotherRound = 'n';
        break;
      }

      //if both hands are empty prompt the player if they want to go another round

      if (currentGame.computerHand.length === 0 && currentGame.playerHand.length === 0) {
        console.log(`Your Health: ${currentGame.player.stats.wounds}`);
        console.log(`Ork's Health: ${currentGame.computer.stats.wounds}`);
        
        anotherRound = readlineSync.question("Do you want to go another round? (y / n)");

        while (anotherRound !== 'y' && anotherRound !== 'n') {
          anotherRound = readlineSync.question("What 'r you waitng for!? Do you want to go another round? (y / n)");
        }

        break;
      }
    }

    //report results of battle (in the future, this would report win or loss to player, etc.)
    if (currentGame.player.stats.wounds >= 0 && currentGame.computer.stats.wounds > 0) {
      console.log('You ran Coward!');
    } else if (currentGame.player.stats.wounds <= 0) {
      console.log("You Dead!");
    } else {
      console.log('You Beat Ork!');
    }
  }

}


game();


