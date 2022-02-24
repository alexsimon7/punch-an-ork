'use strict';

const ROLES = {
  'boy(fighter)': {
    
    name: 'Boy (Fighter)',
    
    stats: {
      wounds: 10,
      save: 5,
      defense: 3,
      action_point_limit: 2,
    },

    weapons: {
      name: 'Choppa',
      attacks: 4,
      weapon_skill: 3,
      damage: {
        regular: 4,
        critical: 5,
      },
      // fists: {
      //   name: 'Fists',
      //   attacks: 3,
      //   weapon_skill: 3,
      //   damage: {
      //     regular: 3,
      //     critical: 4,
      //   },
      // },
    },

    abilities: {},
  },

  'guardsmen(trooper)': {
    
    name: 'Guardsman (Trooper)',
    
    stats: {
      wounds: 7,
      save: 5,
      defense: 3,
      action_point_limit: 2,
    },

    weapons: {
      name: 'Bayonet',
      attacks: 4,
      weapon_skill: 4,
      damage: {
        regular: 2,
        critical: 3,
      },
    },
    abilities: {},
  },

  'general': {
    
    name: 'General',
    
    stats: {
      wounds: 9,
      save: 5,
      defense: 3,
      action_point_limit: 2,
    },

    weapons: {
      name: 'Bayonet',
      attacks: 4,
      weapon_skill: 4,
      damage: {
        regular: 2,
        critical: 3,
      },
    },
    abilities: {},
  },
};

module.exports = ROLES;