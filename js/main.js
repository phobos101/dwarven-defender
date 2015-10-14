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
  this.playerHp        = 100

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

  $('#atk-btn').on('click', this.upgradeStat.bind(this, 'atk', 'attack'))
  $('#dfs-btn').on('click', this.upgradeStat.bind(this, 'dfs', 'defence'))
  $('#dge-btn').on('click', this.upgradeStat.bind(this, 'dge', 'dodge'))
  $('#prs-btn').on('click', this.upgradeStat.bind(this, 'prs', 'presence'))
  $('#crt-btn').on('click', this.upgradeStat.bind(this, 'crt', 'agility'))
  $('#hp-btn').on('click', this.upgradeStat.bind(this, 'hp', 'vitality'))

  $('#darius').on('click', this.buyHenchmen.bind(this, 'darius'))
  $('#alaris').on('click', this.buyHenchmen.bind(this, 'alaris'))
  $('#terna').on('click', this.buyHenchmen.bind(this, 'terna'))
  
  this.damageTimer     = setInterval(this.takeDmg.bind(this), 500)
}

Game.prototype.updateStats = function () {
  $('#player-health-bar').attr('max', this.playerHp)
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
  $('#vitality').html('Vitality: ' + this.playerHp)
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

Game.prototype.upgradeStat = function(abr, stat) {
  // Upgrades an ability based on button pushed.
  var capitalAbr = 'player' + abr.charAt(0).toUpperCase() + abr.slice(1)
  var jqueryStat = '#' + stat
  var jqueryBtn  = '#' + abr + '-btn'

  if (this.upgradePoints > 0) {
    if (abr == 'crt' || abr == 'prs' || abr == 'dge') {
      if (this[capitalAbr].toFixed(2) < 90.00) {
        this.playSound('click-high')
        this.upgradePoints -= 1
        this[capitalAbr] += 0.1
        $('#points').html('Points to spend: ' + this.upgradePoints)
        $(jqueryStat).html(stat + ': ' + this[capitalAbr].toFixed(2) + '%')
      }
      else {
        $(jqueryBtn).html('Max Level!')
        $(jqueryBtn).off()
      }
    } // End of critial hit, dodge and presence
    else if (abr == 'hp'){
      this.playSound('click-high')
      this.upgradePoints -= 1
      this[capitalAbr] += 10
      $('#points').html('Points to spend: ' + this.upgradePoints)
      $(jqueryStat).html(stat + ': ' + this[capitalAbr])
      $('#vitality').html('Vitality: ' + this.playerHp)
      this.updateStats()
    }  // End of vitality
    else {
      this.playSound('click-high')
      this.upgradePoints -= 1
      this[capitalAbr] += 1
      $('#points').html('Points to spend: ' + this.upgradePoints)
      $(jqueryStat).html(stat + ': ' + this[capitalAbr])
    } // End of attack and defense
  }
}

//-------------------------------------------
//                 HENCHMEN 
//-------------------------------------------

Game.prototype.buyHenchmen = function(henchmen) {
  var capitalHenchmen = henchmen.charAt(0).toUpperCase() + henchmen.slice(1)
  var jqueryHenchmen  = '#' + henchmen
  var cost            = parseInt($(jqueryHenchmen).attr('cost'))
  var timer           = henchmen + 'Timer'

  if (this.playerGold >= cost) {
    this.playSound('click-high')
    this[timer] = setInterval(this.clickEnemy.bind(this), 1000)
    this.playerGold -= cost
    $('#gold').html('Gold: ' + this.playerGold)
    $(jqueryHenchmen).html(capitalHenchmen + ' Hired!')
    $(jqueryHenchmen).off()
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

  // Start moving enemy towards player
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
        this.enemyHp = -1 //Prevents repeat kills of same enemy!
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