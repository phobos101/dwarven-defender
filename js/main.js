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
  this.upgradePoints   = 0
  this.kills           = 0

  this.playerAtk       = 10
  this.playerDfs       = 0
  this.playerDge       = 5.0
  this.playerPrs       = 1.0

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
  $('#atk-btn').on('click', this.upgradeAttack.bind(this))
  $('#dfs-btn').on('click', this.upgradeDefence.bind(this))
  $('#dge-btn').on('click', this.upgradeDodge.bind(this))
  $('#prs-btn').on('click', this.upgradePresence.bind(this))
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

    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#attack').html('Attack: ' + this.playerAtk)
    $('#defence').html('Defence: ' + this.playerDfs)
    $('#dodge').html('Dodge: ' + this.playerDge)
    $('#presence').html('Presence: ' + this.playerPrs)
  }
}

Game.prototype.upgradeAttack = function() {
  if (this.upgradePoints > 0) {
    this.upgradePoints -= 1
    this.playerAtk += 1
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#attack').html('Attack: ' + this.playerAtk)
  }
}

Game.prototype.upgradeDefence = function() {
  if (this.upgradePoints > 0) {
    this.upgradePoints -= 1
    this.playerDfs += 1
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#defence').html('Defence: ' + this.playerDfs)
  }
}

Game.prototype.upgradeDodge = function() {
  if (this.upgradePoints > 0) {
    this.upgradePoints -= 1
    this.playerDge += 0.1
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#dodge').html('Dodge: ' + this.playerDge)
  }
}

Game.prototype.upgradePresence = function() {
  if (this.upgradePoints > 0) {
    this.upgradePoints -= 1
    this.playerPrs += 0.1
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#presence').html('Presence: ' + this.playerPrs)
  }
}

Game.prototype.showInv = function() { 
  console.log("Inventory button clicked!")
}

Game.prototype.takeDmg = function() {
  var randomNum = (Math.random()*100).toFixed(2)
  console.log(randomNum)

  if (!document.getElementById('enemy').hasAttribute('paused')) {
    if (document.getElementById('enemy').hasAttribute('damage')) {
      if (randomNum > this.playerDge) {
        console.log('Taking ' + (this.level+5*1.1) + ' damage! Player has ' + this.playerDfs 
                   + ' defence = ' + (this.level - this.playerDfs))
        this.playerCurrentHp -= ((this.level+5*1.1) - this.playerDfs)
        this.updateStats()
      }
      else {
        console.log('Player dodges!')
      }
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
    this.upgradePoints += 5
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

  // Position and show new enemy
  $('#enemy').css("left", this.enemyPos + '%')
  $('#enemy').attr('src', 'assets/enemy_side_transparent.gif')
  $('#enemy').fadeIn(200)

  // Start moveing enemy towards player
  this.moveTimer = setInterval(this.moveEnemy.bind(this), 100)
}

Game.prototype.moveEnemy = function() {
  var baseMove = 0.3
  var computedMove = (baseMove - (this.playerPrs / 100))

  if (!document.getElementById('enemy').hasAttribute('paused')) {
    if (this.enemyPos > 30) {
      this.enemyPos -= computedMove;
      $('#enemy').css("left", this.enemyPos + '%')
    }
    else {
      $('#enemy').attr('damage', 'on')
    }
  }
}

Game.prototype.clickEnemy = function() {
  if (this.enemyHp > 0) {
    this.enemyHp -= this.playerAtk;
    if (this.enemyHp > 0) {
      $('#enemy-health-bar').attr('value', this.enemyHp)
    }
    else {
      $('#enemy-health-bar').attr('value', 0)
      console.log("Death!")
      document.getElementById('enemy').removeAttribute('damage')
      this.kills++
      $('#enemy').fadeOut(1000)
      setTimeout(this.spawnEnemy.bind(this), 1100)
      clearInterval(this.moveTimer)
      this.enemyHp = -1
    }
    console.log(this.enemyHp)
  }
  else {
    console.log('Enemy already fading')
  }
} // End of clickEnemy function