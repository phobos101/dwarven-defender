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
  this.playerXp        = 0;
  this.playerLevel     = 1;
  this.playerGold      = 0;
  this.xpToLevel       = 1000 * (this.playerLevel * 2);

  this.updateStats();
  this.spawnEnemy(); 
}

Game.prototype.updateStats = function () {
  $('#player-health-bar').css('width', this.playerCurrentHp + '%')
  $('#level').html('Level: ' + this.playerLevel)
}

Game.prototype.spawnEnemy = function() {
  var newEnemy = new Enemy();
}


//-------------------------------------------
//              ENEMY OBJECT
//-------------------------------------------

function Enemy() {
  this.name        = this.getName()
  this.hp          = 100
  this.pos         = 50
  this.$avatar     = $('#enemy')
  this.$healthBar  = $('#enemy-health-bar')
  console.log(this)

  this.$avatar.attr('src', 'assets/enemy_side_transparent.gif')

  this.$avatar.on("click", this.click.bind(this))

  this.moveTimer = setInterval(this.move.bind(this), 100)
}

Enemy.prototype.recreate = function() {
  console.log("New Mob")
  this.$healthBar.css('width', '100%')
}

Enemy.prototype.move = function() {
  this.pos += 1;
  this.$avatar.css("right", this.pos)
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
  if (this.hp > 1) {
    this.hp -= 10;
    this.$healthBar.css('width', this.hp + '%')
  }
  else if (this.hp == 0) {
    console.log("Death!")
    this.$avatar.fadeOut(1000)
    setTimeout(this.recreate.bind(this), 1100)
    clearInterval(this.moveTimer)
    var fading = true;
    this.hp = -1 // Prevent repeat recreates
  }
  else {
    console.log('Enemy already fading')
  }
}