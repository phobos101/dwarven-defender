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

  Game.prototype.despawnEnemy = function() {
    if (document.getElementById('enemy-health-bar').getAttribute('style') == 'width: 0%;') {
      console.log("Kill it!")
      newEnemy.cleanUp();
      newEnemy = undefined;
      delete newEnemy;
      console.log(newEnemy)
      $('#enemy-health-bar').css('width', '100%')
    }
  }
}


//-------------------------------------------
//              ENEMY OBJECT
//-------------------------------------------

function Enemy(level) {
  this.name        = this.getName();
  this.playerLevel = level;
  this.hp          = 100; // 100 * playerLevel
  this.pos         = 50;
  this.$avatar     = $('#enemy');
  this.$healthBar  = $('#enemy-health-bar');

  this.$avatar.attr('src', 'assets/enemy_side_transparent.gif');
  this.$avatar.on("click", this.click.bind(this)); // Must bind to pass enemy and not the picture!

  this.moveTimer = setInterval(this.move.bind(this), 100);
}

Enemy.prototype.move = function() {
  this.pos += 1;
  this.$avatar.css("right", this.pos);
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
  return enemyNames[Math.floor(Math.random()*7)];
}

Enemy.prototype.click = function() {
  this.hp -= 10;
  this.$healthBar.css('width', this.hp + '%');

  if (this.hp <= 0) {
    Game.prototype.despawnEnemy()
  }

  console.log(this.hp);
}

Enemy.prototype.cleanUp = function() {
  clearInterval(this.moveTimer);
  this.name = undefined;
  this.playerLevel = null;
  this.hp = null;
  this.pos = null;
  this.$avatar.attr('src', '');
  this.$avatar.off;
  this.$avatar = undefined;
  this.$healthBar = undefined;
}