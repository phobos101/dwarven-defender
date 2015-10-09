//--------------------------------------
//                START
//--------------------------------------
$(function() {
  var game = new Game();
});

function Game() {
  this.playerCurrentHp = 100;
  this.playerMaxHp     = 100;
  this.enemyCurrentHp  = 100;
  this.enemyMaxHp      = 100;
  this.playerXp        = 0;
  this.playerLevel     = 1;
  this.playerGold      = 0;
  this.xpToLevel       = 1000 * (this.playerLevel * 2);

  this.updateStats();
  this.spawnEnemy();
}

Game.prototype.updateStats = function () {
  console.log(this.playerCurrentHp)
  console.log(this)
  $('#player-health-bar').css('width', this.playerCurrentHp + '%')
  $('#player-hp').html('HP: ' + this.playerCurrentHp + ' / ' + this.playerMaxHp)
  $('#enemy-health-bar').css('width', this.enemyCurrentHp + '%')
  $('#enemy-hp').html('Enemy: ' + this.enemyCurrentHp + ' / ' + this.enemyMaxHp)
  $('#level').html('Level: ' + this.playerLevel)
}

Game.prototype.spawnEnemy = function() {
  var newEnemy = new Enemy;
  console.log(newEnemy)
}

function Enemy() {
  this.name    = this.getName()
  this.hp      = 100; // 100 * playerLevel
  this.$avatar = $('#enemy')

  this.$avatar.attr('src', 'assets/enemy_side_transparent.gif')
}

Enemy.prototype.getName = function() {
  var enemyNames = [
                    "Xarg",
                    "Jerxag",
                    "Slath",
                    "Laoth",
                    "glatt",
                    "Jahtg",
                    "Yuarn"
                   ]
  return enemyNames[Math.floor(Math.random()*7)]
}