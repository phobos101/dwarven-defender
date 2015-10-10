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
  this.$statButton     = $('#stats-btn')
  this.$invButton      = $('#inv-btn')

  this.updateStats();
  this.spawnEnemy();

  this.$statButton.on("click", this.showStats.bind(this))
  this.$invButton.on("click", this.showInv.bind(this))

  setInterval(this.takeDmg.bind(this), 500)
}

Game.prototype.updateStats = function () {
  $('#player-health-bar').css('width', this.playerCurrentHp + '%')
  $('#level').html('Level: ' + this.playerLevel)
}

Game.prototype.spawnEnemy = function() {
  var newEnemy = new Enemy();
}

Game.prototype.showStats = function() {
  // Stats Button clicked
  console.log("Stats button clicked!")
}

Game.prototype.showInv = function() { 
  // Inventory button clicked
  console.log("Inventory button clicked!")
}

Game.prototype.takeDmg = function() {
  if (document.getElementById('enemy').hasAttribute('damage')) {
    console.log('Takeing Damage!')
    this.playerCurrentHp -= 1
    this.updateStats()
  }
}

//-------------------------------------------
//              ENEMY OBJECT
//-------------------------------------------

function Enemy() {
  this.name        = this.getName()
  this.hp          = 100
  this.deaths      = 0
  this.pos         = 80.0
  this.$avatar     = $('#enemy')
  this.$healthBar  = $('#enemy-health-bar')
  console.log(this)

  this.$avatar.attr('src', 'assets/enemy_side_transparent.gif')
  this.$avatar.on("click", this.click.bind(this))
  this.moveTimer = setInterval(this.move.bind(this), 100)
}

Enemy.prototype.recreate = function() {
  // Recyles the enemy instance to be a new enemy
  console.log("New Mob #" + this.deaths)
  this.$healthBar.css('width', '100%')
  this.name = this.getName()
  this.hp   = 100
  this.pos  = 80.0
  console.log(this)

  this.$avatar.attr('src', 'assets/enemy_side_transparent.gif')
  this.$avatar.fadeIn(200)

  // this.$avatar.on("click", this.click.bind(this))
  this.moveTimer = setInterval(this.move.bind(this), 100)
}

Enemy.prototype.move = function() {
  if (this.pos > 30) {
    this.pos -= 0.2;
    this.$avatar.css("left", this.pos + '%')
  }
  else {
    this.$avatar.attr('damage', 'on')
  }
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
    document.getElementById('enemy').removeAttribute('damage')
    this.deaths++
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