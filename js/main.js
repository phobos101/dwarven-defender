//-------------------------------------------
//                    START
//-------------------------------------------
$(function() {
  $('#start').on('click', start)
});

function start() {
  $('#start').css('display', 'none')
  var game = new Game()
}

//-------------------------------------------
//                 GAME OBJECT
//-------------------------------------------

function Game() {
  this.playerCurrentHp = 100
  this.playerMaxHp     = 100
  this.playerXp        = 0
  this.level           = 1
  this.playerGold      = 0
  this.kills           = 0
  this.enemyHp         = 100 * this.level
  this.enemyPos        = 80.0
  this.$statButton     = $('#stats-btn')
  this.$invButton      = $('#inv-btn')

  $('#level').html('Level: ' + this.level)

  this.updateStats()
  this.spawnEnemy()

  this.$statButton.on("click", this.showStats.bind(this))
  this.$invButton.on("click", this.showInv.bind(this))
  $('#enemy').on("click", this.clickEnemy.bind(this))

  $('#dev-kill-player').on('click', this.killPlayer.bind(this))

  this.damageTimer = setInterval(this.takeDmg.bind(this), 500)
}

Game.prototype.killPlayer = function() {
  // DEV DEBUG USE ONLY!
  this.playerCurrentHp = 0
}

Game.prototype.updateStats = function () {
  $('#player-health-bar').attr('max', this.playerMaxHp)
  $('#player-health-bar').attr('value', this.playerCurrentHp)
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
    // Show the stats window and pause the game
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
      console.log('Taking ' + this.level + ' damage!')
      this.playerCurrentHp -= this.level
      this.updateStats()
    }
  }
  if (this.playerCurrentHp < 1) {
    // Game over
    this.gameOver()
  }
}

Game.prototype.gameOver = function() {
    clearInterval(this.damageTimer)

    $('#enemy').attr('paused', 'on')
    $('#player-alive-div').css('display', 'none')
    $('#player-dead-div').css('display', 'block')
    $('#game-stats').html('You reached level ' + this.level + '<br />'
                         +'You killed ' + this.kills + ' enemies')
}

//-------------------------------------------
//              ENEMY THINGS
//-------------------------------------------

Game.prototype.spawnEnemy = function() {
  console.log("New Mob #" + (this.kills + 1))

  if ((this.kills % 5 == 0) && this.kills != 0) {
    this.level += 1
    $('#level').html('Level: ' + this.level)
    $('#level').attr('level', this.level)
  }

  // if (this.kills % 10 == 0) {
  //   // boss battle
  // }

  // Set up new enemy
  this.enemyHp   = 100 * this.level
  this.enemyPos  = 80.0
  $('#enemy-health-bar').attr('max', this.enemyHp)
  $('#enemy-health-bar').attr('value', this.enemyHp)
  console.log(this)

  // Position and show new enemy
  $('#enemy').css("left", this.enemyPos + '%')
  $('#enemy').attr('src', 'assets/enemy_side_transparent.gif')
  $('#enemy').fadeIn(200)

  // Start moveing enemy towards player
  this.moveTimer = setInterval(this.moveEnemy.bind(this), 100)
}

Game.prototype.moveEnemy = function() {
  if (!document.getElementById('enemy').hasAttribute('paused')) {
    if (this.enemyPos > 30) {
      this.enemyPos -= 0.2;
      $('#enemy').css("left", this.enemyPos + '%')
    }
    else {
      $('#enemy').attr('damage', 'on')
    }
  }
}

Game.prototype.clickEnemy = function() {
  if (this.enemyHp > 11) {
    this.enemyHp -= 10;
    $('#enemy-health-bar').attr('value', this.enemyHp)
    console.log(this.enemyHp)
  }
  else if (this.enemyHp == 10) {
    this.enemyHp -= 10;
    $('#enemy-health-bar').attr('value', this.enemyHp)
    console.log(this.enemyHp)
    console.log("Death!")
    document.getElementById('enemy').removeAttribute('damage')
    this.kills++
    $('#enemy').fadeOut(1000)
    setTimeout(this.spawnEnemy.bind(this), 1100)
    clearInterval(this.moveTimer)
    var fading = true;
    this.enemyHp = -1 // Prevent repeat recreates
  }
  else {
    console.log('Enemy already fading')
  }
} // End of clickEnemy function