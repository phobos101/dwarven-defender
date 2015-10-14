//-------------------------------------------
//                    START
//-------------------------------------------
$(function() {
  soundManager.setup({
    url: "/swf/",
    preferFlash: false
  })

  setTimeout(function() {
    var currentSound = soundManager.createSound({
      id: 'menu',
      url: './assets/sounds/menu-music.mp3',
    });
    currentSound.play();
  }, 500)

  setInterval(changeBackground, 1000)
  function changeBackground () {
    $('#content').toggleClass('background-change')
  }

  $('#player').on('click', start)
});

function start() {
  soundManager.stopAll()
  $('#player').off()
  var game = new Game()
}

//-------------------------------------------
//                 GAME OBJECT
//-------------------------------------------

function Game() {
  this.playerCurrentHp = 100
  this.playerXp        = 0
  this.level           = 1
  this.playerGold      = 0
  this.upgradePoints   = 0
  this.kills           = 0
  this.enemyMod        = 1

  this.playerAtk       = 10
  this.playerDfs       = 0
  this.playerDge       = 5.0
  this.playerPrs       = 1.0
  this.playerCrt       = 5.0
  this.playerMaxHp     = 100

  this.enemyHp         = 100 * this.level
  this.enemyPos        = 80.0
  this.image           = 1

  $('#intro-text').css('display', 'none')
  $('#stats-btn').css('display', 'block')
  $('#stats-btn').css('float', 'right')
  $('#henchmen-btn').css('display', 'block')
  $('#henchmen-btn').css('float', 'left')

  $('#player').attr('src', 'assets/player_side_transparent.gif')
  $('#player').css('left', '5%')

  $('#level').html('Level: ' + this.level)
  $('#gold').html('Gold: ' + this.playerGold)

  this.updateStats()
  this.spawnEnemy()

  $('#stats-btn').on('click', this.showStats.bind(this))
  $('#henchmen-btn').on('click', this.showHenchmen.bind(this))
  $('.close').on('click', this.closeWindow.bind(this))
  $('#enemy').on('click', this.clickEnemy.bind(this))

  $('#atk-btn').on('click', this.upgradeAttack.bind(this))
  $('#dfs-btn').on('click', this.upgradeDefence.bind(this))
  $('#dge-btn').on('click', this.upgradeDodge.bind(this))
  $('#prs-btn').on('click', this.upgradePresence.bind(this))
  $('#crt-btn').on('click', this.upgradeAgility.bind(this))
  $('#hp-btn').on('click', this.upgradeVitality.bind(this))

  $('#darius').on('click', this.buyDarius.bind(this))
  $('#alaris').on('click', this.buyAlaris.bind(this))
  $('#terna').on('click', this.buyTerna.bind(this))
  
  this.damageTimer     = setInterval(this.takeDmg.bind(this), 500)
  // this.playSound('game-music')
}

Game.prototype.updateStats = function () {
  $('#player-health-bar').attr('max', this.playerMaxHp)
  $('#player-health-bar').attr('value', this.playerCurrentHp)
}

Game.prototype.takeDmg = function() {
  if (!document.getElementById('enemy').hasAttribute('paused')) {
    if (document.getElementById('enemy').hasAttribute('damage')) {
      var randomNum = (Math.random()*100).toFixed(2)
      var dmgTaken = Math.round(this.level * (2 * this.enemyMod)) - this.playerDfs
      if (dmgTaken < 1) {
        // Prevents player with higher defence than enemy damage gaining HP
        dmgTaken = 1
      }
      if (randomNum > this.playerDge) {
        this.playerCurrentHp -= dmgTaken
        this.playSound('enemy-hit')
        this.updateStats()

        // Show player floating damage
        $('#player-damage-text').show()
        $('#player-damage-text').html('-' + dmgTaken + ' hp')
        $('#player-damage-text').fadeOut(400)
      }
      else {
        $('#player-damage-text').show()
        $('#player-damage-text').html('Dodge!')
        $('#player-damage-text').fadeOut(400)
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
    $('#refresh').on('click', this.replay) 
}

Game.prototype.replay = function() {
  soundManager.stopAll()
  location.reload(true)
}

//-------------------------------------------
//                 BUTTONS 
//-------------------------------------------

Game.prototype.closeWindow = function() {
  this.playSound('click-low')
  console.log("Game resumed")
  $('#stats-window').css('display', 'none')
  $('#henchmen-window').css('display', 'none')
  $('#buttons').css('display', 'block')
  $('#top-bar').css('display', 'block')
  $('#enemy').css('display', 'block')
  $('#player').css('display', 'block')
  document.getElementById('enemy').removeAttribute('paused')
}

Game.prototype.showStats = function() {
  // Show the stats window and pause the game
  console.log("Game paused")
  this.playSound('click-high')
  $('#stats-window').css('display', 'block')
  $('#buttons').css('display', 'none')
  $('#top-bar').css('display', 'none')
  $('#enemy').css('display', 'none')
  $('#player').css('display', 'none')
  $('#enemy').attr('paused', 'on')
  $('#points').html('Points to spend: ' + this.upgradePoints)
  $('#attack').html('Attack: ' + this.playerAtk)
  $('#defence').html('Defence: ' + this.playerDfs)
  $('#dodge').html('Dodge: ' + this.playerDge.toFixed(2) + '%')
  $('#presence').html('Presence: ' + this.playerPrs.toFixed(2) + '%')
  $('#agility').html('Agility: ' + this.playerCrt.toFixed(2) + '%')
  $('#vitality').html('Vitality: ' + this.playerMaxHp)
}

Game.prototype.showHenchmen = function() {
  // Show the henchmen window and pause the game
  this.playSound('click-high')
  console.log("Game paused")
  $('#henchmen-window').css('display', 'block')
  $('#buttons').css('display', 'none')
  $('#top-bar').css('display', 'none')
  $('#enemy').css('display', 'none')
  $('#player').css('display', 'none')
  $('#enemy').attr('paused', 'on')
  $('#hench-gold').html('Gold: ' + this.playerGold)
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
    if (this.playerDge.toFixed(2) < 90.00) {
      this.playSound('click-high')
      this.upgradePoints -= 1
      this.playerDge += 0.1
      $('#points').html('Points to spend: ' + this.upgradePoints)
      $('#dodge').html('Dodge: ' + this.playerDge.toFixed(2) + '%')
    }
    else {
      $('#dge-btn').html('Max Level!')
      $('#dge-btn').off()
    }
  }
}

Game.prototype.upgradePresence = function() {
  if (this.upgradePoints > 0) {
    if (this.playerPrs.toFixed(2) < 90.00) {
      this.playSound('click-high')
      this.upgradePoints -= 1
      this.playerPrs += 0.1
      $('#points').html('Points to spend: ' + this.upgradePoints)
      $('#presence').html('Presence: ' + this.playerPrs.toFixed(2) + '%')
    }
    else {
      $('#prs-btn').html('Max Level!')
      $('#prs-btn').off()
    }
  }
}

Game.prototype.upgradeAgility = function() {
  if (this.upgradePoints > 0) {
    if (this.playerCrt.toFixed(2) < 100.00) {
      this.playSound('click-high')
      this.upgradePoints -= 1
      this.playerCrt += 0.1
      $('#points').html('Points to spend: ' + this.upgradePoints)
      $('#agility').html('Agility: ' + this.playerCrt.toFixed(2) + '%')
    }
    else {
      $('#crt-btn').html('Max Level!')
      $('#crt-btn').off()
    }
  }
}

Game.prototype.upgradeVitality = function() {
  if (this.upgradePoints > 0) {
    this.playSound('click-high')
    this.upgradePoints -= 1
    this.playerMaxHp += 10
    this.playerCurrentHp = this.playerMaxHp
    $('#points').html('Points to spend: ' + this.upgradePoints)
    $('#vitality').html('Vitality: ' + this.playerMaxHp)
    this.updateStats()
  }
}

//-------------------------------------------
//                 HENCHMEN 
//-------------------------------------------

Game.prototype.buyDarius = function() {
  if (this.playerGold >= 100) {
    this.playSound('click-high')
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

  // Set up new enemy
  if ((this.level % 5 == 0) && this.level != 1) {
    // Scale enemy HP & DMG with every 5 levels
    this.enemyMod *= 1.2
  }

  this.enemyHp   = 100 * (this.level * this.enemyMod)
  this.enemyPos  = 80.0
  $('#enemy-health-bar').attr('max', this.enemyHp)
  $('#enemy-health-bar').attr('value', this.enemyHp)

  // Position and show new enemy
  $('#enemy').css("left", this.enemyPos + '%')
  $('#enemy').attr('src', 'assets/enemy_side_transparent.gif')
  $('#enemy').fadeIn(200)

  // Start moveing enemy towards player
  this.moveTimer = setInterval(this.moveEnemy.bind(this), 200)
}

Game.prototype.moveEnemy = function() {
  var baseMove = 1.01
  var computedMove = (baseMove - (this.playerPrs / 100))
  $('#enemy').attr('src', 'assets/enemy_side_transparent.gif')
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
      var randomNum = Math.ceil(Math.random()* 100).toFixed(2)
      if (randomNum < this.playerCrt) {
        // Critical hit!
        var crit = true;
        var critDmg = this.playerAtk * 10
        this.enemyHp -= critDmg
      }
      else {
        this.enemyHp -= this.playerAtk;
      }
      this.playSound('enemy-hit')

      // Show floating damage
      $('#enemy-damage-text').show()
      $('#enemy-damage-text').css("left", (this.enemyPos + 5) + '%')
      if (crit) {
        $('#enemy-damage-text').html('CRIT! -' + critDmg + ' hp')
      }
      else {
        $('#enemy-damage-text').html('-' + this.playerAtk + ' hp')
      }
      $('#enemy-damage-text').fadeOut(400)
      $('#enemy').attr('src', 'assets/enemy-hit.gif')
      
      // After Hit
      if (this.enemyHp > 0) {
        // Enemy still alive
        $('#enemy-health-bar').attr('value', this.enemyHp)
      }
      else {
        // Mob dies
        var randomNum = Math.ceil(Math.random()*20)
        $('#enemy-health-bar').attr('value', 0)
        this.playSound('enemy-death')
        $('#enemy-damage-text').html("")
        $('#enemy').attr('src', 'assets/enemy-dead.gif')
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
//           SOUNDS AND ASSETS
//-------------------------------------------


Game.prototype.playSound = function(sound) {
  soundManager.stopAll()
  var value = sound
  this._currentSound = null

  if (this._currentSound == null) {
    this._currentSound = soundManager.createSound({
      id: value,
      url: './assets/sounds/' + value + '.mp3'
    });
  }
  this._currentSound.play();
}