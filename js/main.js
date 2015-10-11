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
  this.level           = 1;
  this.playerGold      = 0;
  this.$statButton     = $('#stats-btn')
  this.$invButton      = $('#inv-btn')
  $('#level').html('Level: ' + this.level)

  this.updateStats();
  this.spawnEnemy();

  this.$statButton.on("click", this.showStats.bind(this))
  this.$invButton.on("click", this.showInv.bind(this))

  setInterval(this.takeDmg.bind(this), 500)
}

Game.prototype.updateStats = function () {
  $('#player-health-bar').attr('max', this.playerMaxHp)
  $('#player-health-bar').attr('value', this.playerCurrentHp)
}

Game.prototype.spawnEnemy = function() {
  var newEnemy = new Enemy();
}

Game.prototype.showStats = function() {
  if (document.getElementById('stats-window').hasAttribute('show')) {
    // Hide the window if open
    console.log("Game resumed")
    $('#stats-window').css('display', 'none')
    document.getElementById('stats-window').removeAttribute('show')
    $('#enemy').css('display', 'block')
    $('#player').css('display', 'block')
    document.getElementById('enemy').removeAttribute('paused')
  }
  else {
    // Show the stats window and pause trhe game
    console.log("Game paused")
    $('#stats-window').css('display', 'block')
    $('#stats-window').attr('show', 'on')
    $('#enemy').css('display', 'none')
    $('#player').css('display', 'none')
    $('#enemy').attr('paused', 'on')
  }
}

Game.prototype.showInv = function() { 
  console.log("Inventory button clicked!")
}

Game.prototype.takeDmg = function() {
  if (!document.getElementById('enemy').hasAttribute('paused')) {
    if (document.getElementById('enemy').hasAttribute('damage')) {
      this.level = document.getElementById('level').getAttribute('level')
      console.log('Taking ' + this.level + ' damage!')
      this.playerCurrentHp -= this.level
      this.updateStats()
    }
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
  this.level       = 1
  this.$avatar     = $('#enemy')
  this.$healthBar  = $('#enemy-health-bar')
  console.log(this)

  this.$avatar.attr('src', 'assets/enemy_side_transparent.gif')
  this.$avatar.on("click", this.click.bind(this))
  this.moveTimer = setInterval(this.move.bind(this), 100)
}

Enemy.prototype.recreate = function() {
  // Recyles the enemy instance to be a new enemy
  if (this.deaths % 5 == 0) {
    this.level += 1
    $('#level').html('Level: ' + this.level)
    $('#level').attr('level', this.level)
  }

  // if (this.deaths % 10 == 0) {
  //   // boss battle

  // }

  console.log("New Mob #" + this.deaths)
  this.name = this.getName()
  this.hp   = 100 * this.level
  this.pos  = 80.0
  this.$healthBar.attr('max', this.hp)
  this.$healthBar.attr('value', this.hp)
  console.log(this)

  this.$avatar.attr('src', 'assets/enemy_side_transparent.gif')
  this.$avatar.fadeIn(200)

  this.moveTimer = setInterval(this.move.bind(this), 100)
}

Enemy.prototype.move = function() {
  if (!document.getElementById('enemy').hasAttribute('paused')) {
    if (this.pos > 30) {
      this.pos -= 0.2;
      this.$avatar.css("left", this.pos + '%')
    }
    else {
      this.$avatar.attr('damage', 'on')
    }
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
  if (this.hp > 11) {
    this.hp -= 10;
    this.$healthBar.attr('value', this.hp)
    console.log(this.hp)
  }
  else if (this.hp == 10) {
    this.hp -= 10;
    this.$healthBar.attr('value', this.hp)
    console.log(this.hp)
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