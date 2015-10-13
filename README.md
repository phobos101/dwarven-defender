#Dwarven Defender!

###GA WDI-LDN-16 - Project 1
#####[Play it here!](https://glacial-hamlet-1798.herokuapp.com/ "Here!")

Dwarven Defender is a clicker type game inspired by titles such as 'Cookie Clicker' 
and 'Clicker Heroes'.

The objective is to kill the enemy goblin by repeatedly tapping or clicking on it.
Upon killing an enemy, a new goblin will spawn. The game can be played indefinatly, 
with the enemies HP and damage scaling exponentially as you progress.

![](./assets/screenshot1.png)

#####Gameplay

1. Each new enemy starts on the right of the screen and progressively moves towards the player.
2. Don't let the enemy get too close! It will deal damage to the player if it is near.
3. Tap / click on the enemy goblin to deal damage to it!
4. When an enemy is killed, it will drop some gold for the player and a new enemy will spawn.
5. Gold is used to hire henchmen. Please see the 'henchmen' section for more information.
6. Every 5 kills will result in a level up! Each level gives the player 5 points to upgrade.
7. If the player reaches 0 HP, the game is over and you see your game statistics.

#####Upgrades

Every level will reward the player with 5 upgrade points. These points are used to upgrade
various aspects of your hero.

* Attack:      Increased click damage by 1 per purchase. This also affects henchmen.
* Defense:     Increased resistance to enemy attacks by 1 per purchase.
* Speed:       Increased chance to dodge by .1%. Dodge will avoid all damage from a single attack.
* Presence:    Decreases the enemies movement speed by .1% per purchase.
* Agility:     Increased critical hit chance by .1% per purchase (crits do x10 damage).
* Vitality:    Increased hero health by 10HP per purchase. Choosing this also fully heals your hero!

![](./assets/upgrades.png)

#####Henchmen

Henchmen aid the player by clicking on enemies for you! Hencmen are hired with gold that
the player automatically collects from fallen enemies. Hencmen are not mutually exclusive, 
so you can have one or more henchmen active at once. The current henchmen are:

* Darius the lame -  Darius is a n00b adventurer who lazily clicks on the enemy once per second.
* Alaris the Meh  -  Alaris is an average warrior capable of clicking on the enemy 5 times per second.
* Terna the cool -      Terna is a veteran goblin hunter that clicks on the enemy 10 times per second.

#####Progression

Dwarven Defender is a game that goes on forever as long as the player is alive. This is acomplished
by having an exponential scale that increases the enemies HP and damage. The equation for the enemy HP for 
instance, is: 100 * X * (1.2 ^ Y) where X is the current level, and Y is the number of times 5 goes into X.

The player will reach the next level every 5 kills. To have a chance of surviving, the player must upgrade 
thier attributes and hire henchmen. 

![](./assets/hp-scale.png)