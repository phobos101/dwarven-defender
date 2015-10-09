//-------------------------------------------
//                    START
//-------------------------------------------
$(function() {
  var game = new Game();
});

//-------------------------------------------
//                 GAME OBJECT
//-------------------------------------------

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
  this.spawnEnemy(this.playerLevel); //create new enemy based on the players level
}

Game.prototype.updateStats = function () {
  $('#player-health-bar').css('width', this.playerCurrentHp + '%')
  $('#level').html('Level: ' + this.playerLevel)
}

Game.prototype.spawnEnemy = function(level) {
  var newEnemy = new Enemy(level);
  console.log(newEnemy)
}

//-------------------------------------------
//              ENEMY OBJECT
//-------------------------------------------

function Enemy(level) {
  this.name       = this.getName()
  this.hp         = 100 * level; // 100 * playerLevel
  this.$avatar    = $('#enemy')
  this.$healthBar = $('#enemy-health-bar')

  this.$avatar.attr('src', 'assets/enemy_side_transparent.gif')
  this.$avatar.on("click", this.click.bind(this)) // Must bind to pass enemy and not the picture!
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

Enemy.prototype.click = function() {
  console.log(this.hp)
  this.hp -= 10
  this.$healthBar.css('width', this.hp + '%')
}