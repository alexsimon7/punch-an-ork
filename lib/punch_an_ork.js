'use strict';

const readlineSync = require('readline-sync');
const ROLES = require('./roles.js');

let player = ROLES['guardsmen(trooper)'];
let computer = ROLES['boy(fighter)'];

class PunchAnOrk {
  constructor(player, computer) {
    this.player = player;
    this.computer = computer
    this.playerHand = 'x'.repeat(this.player.weapons.bayonet.attacks).split('');
    this.computerHand = 'x'.repeat(this.computer.weapons.choppa.attacks).split('');
    this.playerWeaponSkill = this.player.weapons.bayonet.weapon_skill;
    this.computerWeaponSkill = this.computer.weapons.choppa.weapon_skill;

  };

  rollD6() {
    return Math.ceil(Math.random() * 6);
  }

  playerRollAttackDice() {
    this.playerHand = this.playerHand.map(_element => this.rollD6())
  }

  computerRollAttackDice() {
    this.computerHand = this.computerHand.map(_element => this.rollD6());
  }

  displayDiceRolls(playerHand, enemyHand) {
    let playerDice = playerHand.map(element => String.fromCharCode(9855 + element)).join(' ');
    let enemyDice = enemyHand.map(element => String.fromCharCode(9855 + element)).join(' ');

    console.log(`Your Roll: ${playerDice}`);
    console.log(`Your Weapon Skill: ${this.playerWeaponSkill}+`);
    console.log('');
    console.log(`The Ork's Roll: ${enemyDice}`);
    console.log(`The Ork's Weapon Skill: ${this.computerWeaponSkill}+`);
  }

  discardFailedDice(dice, weapon_skill) {
    return dice.filter(element => element >= weapon_skill);
  }

  playerWeaponSelect() {
    
  }

  allocateHits() {

  }

  parryHits() {

  }

  dealDamage() {

  }


}

function game() {
  let currentGame = new PunchAnOrk(player, computer);
  
  console.clear();
  let pause = readlineSync.question("Welcome ta Punch n' Ork!");
  
  // console.clear();
  // pause = readlineSync.question("Are ya brave enuf ta come to try n punch me?");

  // console.clear();
  // pause = readlineSync.question("Build Out Player Selection.");

  // console.clear();
  // pause = readlineSync.question("Let's Fight!! WAAAAAAARGH!!");

  // console.clear();
  // let playerRollDice = readlineSync.question("You have [will state player attacks] attack dice. Roll? (y / n)");

  // while(playerRollDice !== 'y') {
  //   pause = readlineSync.question("What 'r you waitng for!? Let's Fight!! WAAAAAAARGH!!");
  //   playerRollDice = readlineSync.question("You have [will state player attacks] attack dice. Roll? (y / n)");
  // }

  console.clear();
  
  //start abstracted

  currentGame.playerRollAttackDice();
  currentGame.computerRollAttackDice();

  currentGame.displayDiceRolls(currentGame.playerHand, currentGame.computerHand);

  //end abstracted

  currentGame.playerHand = currentGame.discardFailedDice(currentGame.playerHand, currentGame.playerWeaponSkill);
  currentGame.computerHand = currentGame.discardFailedDice(currentGame.computerHand, currentGame.computerWeaponSkill);

  pause = readlineSync.question("");

  console.clear();
 
  console.log(`With Failed Dice Removed, Your Roll: ${currentGame.displayDiceRoll(currentGame.playerHand)}`);
  console.log(`Your Weapon Skill: ${currentGame.playerWeaponSkill}+`);
  console.log('');
  console.log(`With Failed Dice Removed, The Ork's Roll: ${currentGame.displayDiceRoll(currentGame.computerHand)}`);
  console.log(`The Ork's Weapon Skill: ${currentGame.computerWeaponSkill}+`);
  console.log('');

  pause = readlineSync.question("");
  
  console.clear();


  while (currentGame.player.stats.wounds > 0 && currentGame.computer.stats.wounds > 0) {
    
    console.clear();
    console.log(`Your Current Dice Pool: ${currentGame.displayDiceRoll(currentGame.playerHand)}`);
    console.log('');
    console.log(`The Ork's Current Dice Pool: ${currentGame.displayDiceRoll(currentGame.computerHand)}`);

    pause = readlineSync.question("");

    if (currentGame.playerHand.length > 0) {
      let chosenDice = readlineSync.question('Choose a Dice.');

      while (!currentGame.playerHand.includes(+chosenDice)) {
        chosenDice = readlineSync.question('Invalid Selection. Choose a Dice.');
      }
      
      currentGame.playerHand.splice(currentGame.playerHand.indexOf(+chosenDice), 1);
    
      let diceAction = readlineSync.question('Attack, Parry, or Run?');
  
      while (diceAction !== 'Attack' && diceAction !== 'Parry' && diceAction !== 'Run') {
        diceAction = readlineSync.question('Invalid Action. Attack, Parry, or Run?');
        
        //Known Issue - Where Ork Only Has Crits and Player Only Has Non-Crits and Attempts to Parry
        // while (diceAction === 'Parry' && !(currentGame.playerHand.includes(6)) && (currentGame.computerHand.filter(element => 
        //   element !== 6).length === 0)) {
        //   diceAction = readlineSync.question('Invalid Parry. Attack or Run?');
        // }
  
      } 
  
      if (diceAction === 'Attack') {
        if (chosenDice === '6') {
          console.log(`You've crit the Ork for ${currentGame.player.weapons.bayonet.damage.critical} damage`);
  
          pause = readlineSync.question("");
  
          currentGame.computer.stats.wounds -= currentGame.player.weapons.bayonet.damage.critical;
          
          console.log(`The Ork's Health: ${currentGame.computer.stats.wounds}`); //Fix Negative Health
  
          pause = readlineSync.question("");
  
        } else {
          console.log(`You've hit the Ork for ${currentGame.player.weapons.bayonet.damage.regular} damage`);
  
          pause = readlineSync.question("");
  
          currentGame.computer.stats.wounds -= currentGame.player.weapons.bayonet.damage.regular;
          
          console.log(`The Ork's Health: ${ currentGame.computer.stats.wounds}`); //Fix Negative Health
  
          pause = readlineSync.question("");
        }
      } else if (diceAction === 'Parry') {
        if (chosenDice === '6') {
          
          let parriedDice = readlineSync.question("Choose One of the Ork's Dice.");
  
          while (!currentGame.computerHand.includes(+parriedDice)) {
            parriedDice = readlineSync.question("Invalid Selection. Choose One of the Ork's Dice.");
          }

          currentGame.computerHand.splice(currentGame.computerHand.indexOf(+parriedDice), 1);

          console.log(`You've removed a ${parriedDice} from the Ork's dice pool!`);
          
          pause = readlineSync.question("");
  
        } else {
          currentGame.computerHand.splice(currentGame.computerHand.indexOf(!(6)), 1);
          console.log(`You've removed a regular hit from the Ork's dice pool!`);
          pause = readlineSync.question("");
        }
      } else if (diceAction === 'Run') {
        console.log(`You run away!`);
        break
      }
    }

    console.clear();
    console.log(`Your Current Dice Pool: ${currentGame.displayDiceRoll(currentGame.playerHand)}`);
    console.log('');
    console.log(`The Ork's Current Dice Pool: ${currentGame.displayDiceRoll(currentGame.computerHand)}`);

    pause = readlineSync.question("");

    if (currentGame.computerHand.length > 0) {
      /*
      Ork AI:
      If the players health is less than or equal to the orks choppa attack, attack
      Else if the Orks health is greater than the crit of his opponent, attack
      Else if the opponents has no actions left, attack
      Else Parry
      */
      if ((currentGame.player.stats.wounds <= currentGame.computer.weapons.choppa.damage.critical) || 
        (currentGame.computer.stats.wounds > currentGame.player.weapons.bayonet.damage.critical) || 
        (currentGame.playerHand.length === 0)) {
        
        if (currentGame.computerHand.includes(6)) {
          
          currentGame.computerHand.splice(currentGame.computerHand.indexOf(6), 1);
          
          console.log(`The Ork chose to attack and has crit you for ${currentGame.computer.weapons.choppa.damage.critical} damage!`);
  
          pause = readlineSync.question("");
  
          currentGame.player.stats.wounds -= currentGame.computer.weapons.choppa.damage.critical;
          
          console.log(`Your Health: ${currentGame.player.stats.wounds}`); //Fix Negative Health
  
          pause = readlineSync.question("");
        } else {
          currentGame.computerHand.splice(currentGame.computerHand.indexOf(!6), 1);
          
          console.log(`The Ork chose to attack and has hit you for ${currentGame.computer.weapons.choppa.damage.regular} damage!`);
  
          pause = readlineSync.question("");
  
          currentGame.player.stats.wounds -= currentGame.computer.weapons.choppa.damage.regular;
          
          console.log(`Your Health: ${currentGame.player.stats.wounds}`); //Fix Negative Health
  
          pause = readlineSync.question("");
        }

      } else {
        console.log('Parry!')
      }
    }


    if (currentGame.computerHand.length === 0 && currentGame.playerHand.length === 0) {
      console.log(`Your Health: ${currentGame.player.stats.wounds}`);
      console.log(`Ork's Health: ${currentGame.computer.stats.wounds}`);
      pause = readlineSync.question("");

      break;
    }

  }
  


}


game();


