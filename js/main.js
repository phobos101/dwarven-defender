//-------------------------------------------
//                    START
//-------------------------------------------
$(function() {
  $('#start').on('click', start)
});

function start() {
  $('#start').css('display', 'none')
  var game = new Game()

  soundManager.setup({
    url: "/swf/",
    preferFlash: false
  })
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

  $('#level').html('Level: ' + this.level)
  $('#gold').html('Gold: ' + this.playerGold)

  this.updateStats()
  this.spawnEnemy()

  $('#stats-btn').on("click", this.showStats.bind(this))
  $('#henchmen-btn').on("click", this.showHenchmen.bind(this))
  $('#enemy').on("click", this.clickEnemy.bind(this))

  $('#atk-btn').on('click', this.upgradeAttack.bind(this))
  $('#dfs-btn').on('click', this.upgradeDefence.bind(this))
  $('#dge-btn').on('click', this.upgradeDodge.bind(this))
  $('#prs-btn').on('click', this.upgradePresence.bind(this))

  $('#darius').on('click', this.buyDarius.bind(this))
  $('#alaris').on('click', this.buyAlaris.bind(this))
  $('#terna').on('click', this.buyTerna.bind(this))
  
  this.damageTimer = setInterval(this.takeDmg.bind(this), 500)

  // this.playSound('game-music')
}

Game.prototype.killPlayer = function() {
  // DEV DEBUG USE ONLY!
  this.playerCurrentHp = 0
}

Game.prototype.updateStats = function () {
  $('#player-health-bar').attr('max', this.playerMaxHp)
  $('#player-health-bar').attr('value', this.playerCurrentHp)
}

Game.prototype.takeDmg = function() {
  if (!document.getElementById('enemy').hasAttribute('paused')) {
    if (document.getElementById('enemy').hasAttribute('damage')) {
      var randomNum = (Math.random()*100).toFixed(2)
      if (randomNum > this.playerDge) {
        console.log('Taking ' + (this.level+5*1.1) + ' damage! Player has ' + this.playerDfs 
                   + ' defence = ' + ((this.level+5*1.1) - this.playerDfs))
        this.playerCurrentHp -= ((this.level+5*1.1) - this.playerDfs)
        this.playSound('player-hit')
        this.updateStats()
      }
      else {
        console.log('Player dodges!')
      }
    }
  }
  if (this.playerCurrentHp < 1) {
    // Game over
    this.playSound('player-death')
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
//                 BUTTONS 
//-------------------------------------------

Game.prototype.showStats = function() {
  if (document.getElementById('stats-window').hasAttribute('show')) {
    // Hide the window if open
    this.playSound('click-low')
    console.log("Game resumed")
    $('#stats-window').css('display', 'none')
    document.getElementById('stats-window').removeAttribute('show')
    $('#enemy').css('display', 'block')
    $('#player').css('display', 'block')
    $('#henchmen-btn').css('display', 'block')
    document.getElementById('enemy').removeAttribute('paused')
  }
  else {
    // Show the stats window and pause the game
    console.log("Game paused")
    this.playSound('click-high')
    $('#stats-window').css('display', 'block')
    $('#stats-window').attr('show', 'on')
    $('#enemy').css('display', 'none')
    $('#player').css('display', 'none')
    $('#henchmen-btn').css('display', 'none')
    $('#enemy').attr('paused', 'on')

    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#attack').html('Attack: ' + this.playerAtk)
    $('#defence').html('Defence: ' + this.playerDfs)
    $('#dodge').html('Dodge: ' + this.playerDge.toFixed(2) + '%')
    $('#presence').html('Presence: ' + this.playerPrs.toFixed(2) + '%')
  }
}

Game.prototype.showHenchmen = function() {
  if (document.getElementById('henchmen-window').hasAttribute('show')) {
    // Hide the window if open
    this.playSound('click-low')
    console.log("Game resumed")
    $('#henchmen-window').css('display', 'none')
    document.getElementById('henchmen-window').removeAttribute('show')
    $('#enemy').css('display', 'block')
    $('#player').css('display', 'block')
    $('#stats-btn').css('display', 'block')
    document.getElementById('enemy').removeAttribute('paused')
  }
  else {
    // Show the stats window and pause the game
    this.playSound('click-high')
    console.log("Game paused")
    $('#henchmen-window').css('display', 'block')
    $('#henchmen-window').attr('show', 'on')
    $('#enemy').css('display', 'none')
    $('#player').css('display', 'none')
    $('#stats-btn').css('display', 'none')
    $('#enemy').attr('paused', 'on')
  }
}

//-------------------------------------------
//                 UPGRADES 
//-------------------------------------------

Game.prototype.upgradeAttack = function() {
  if (this.upgradePoints > 0) {
    this.playSound('click-high')
    this.upgradePoints -= 1
    this.playerAtk += 1
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#attack').html('Attack: ' + this.playerAtk)
  }
}

Game.prototype.upgradeDefence = function() {
  if (this.upgradePoints > 0) {
    this.playSound('click-high')
    this.upgradePoints -= 1
    this.playerDfs += 1
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#defence').html('Defence: ' + this.playerDfs)
  }
}

Game.prototype.upgradeDodge = function() {
  if (this.upgradePoints > 0) {
    this.playSound('click-high')
    this.upgradePoints -= 1
    this.playerDge += 0.1
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#dodge').html('Dodge: ' + this.playerDge.toFixed(2) + '%')
  }
}

Game.prototype.upgradePresence = function() {
  if (this.upgradePoints > 0) {
    this.playSound('click-high')
    this.upgradePoints -= 1
    this.playerPrs += 0.1
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#presence').html('Presence: ' + this.playerPrs.toFixed(2) + '%')
  }
}

//-------------------------------------------
//                 HENCHMEN 
//-------------------------------------------

Game.prototype.buyDarius = function() {
  if (this.playerGold >= 100) {
    this.playSound('click-high')
    console.log('Darius Hired!')
    this.dariusTimer = setInterval(this.clickEnemy.bind(this), 1000)
    this.playerGold -= 100
    $('#gold').html('Gold: ' + this.playerGold)
    $('#darius').html('Darius Hired!')
    $('#darius').off()
  }
}

Game.prototype.buyAlaris = function() {
  if (this.playerGold >= 1000) {
    this.playSound('click-high')
    console.log('Alaris Hired!')
    this.alarisTimer = setInterval(this.clickEnemy.bind(this), 200)
    this.playerGold -= 1000
    $('#gold').html('Gold: ' + this.playerGold)
    $('#alaris').html('Alaris Hired!')
    $('#alaris').off()
  }
}

Game.prototype.buyTerna = function() {
  if (this.playerGold >= 10000) {
    this.playSound('click-high')
    console.log('Terna Hired!')
    this.ternaTimer = setInterval(this.clickEnemy.bind(this), 100)
    this.playerGold -= 10000
    $('#gold').html('Gold: ' + this.playerGold)
    $('#terna').html('Terna Hired!')
    $('#terna').off()
  }
}

//-------------------------------------------
//                  ENEMY 
//-------------------------------------------

Game.prototype.spawnEnemy = function() {
  console.log("New Mob #" + (this.kills + 1))

  if ((this.kills % 5 == 0) && this.kills != 0) {
    this.level += 1
    this.playSound('levelup')
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
  if (!document.getElementById('enemy').hasAttribute('paused')) {
    if (this.enemyHp > 0) {
      this.enemyHp -= this.playerAtk;
      this.playSound('enemy-hit')
      if (this.enemyHp > 0) {
        $('#enemy-health-bar').attr('value', this.enemyHp)
      }
      else {
        var randomNum = Math.ceil(Math.random()*20)
        $('#enemy-health-bar').attr('value', 0)
        this.playSound('enemy-death')
        console.log("Death!")
        document.getElementById('enemy').removeAttribute('damage')
        this.kills++
        this.playerGold += this.level * randomNum
        $('#gold').html('Gold: ' + this.playerGold)
        $('#enemy').fadeOut(1000)
        setTimeout(this.spawnEnemy.bind(this), 1100)
        clearInterval(this.moveTimer)
        this.enemyHp = -1
      }
    }
    else {
      console.log('Enemy already fading')
    }
  }
}

//-------------------------------------------
//                  SOUNDS 
//-------------------------------------------


Game.prototype.playSound = function(sound) {
  soundManager.stopAll()
  var value = sound
  this._currentSound = null

  console.log("playing: " + "./assets/sounds/" + value + ".wav");
  if (this._currentSound == null) {
    this._currentSound = soundManager.createSound({
      id: value,
      url: './assets/sounds/' + value + '.mp3'
    });
  }
  this._currentSound.play();
}

