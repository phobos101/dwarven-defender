//--------------------------------------
//                START
//--------------------------------------
$(start)

function start() {
  var curNum              = 0
  var playerCurrentHp     = 100;
  var playerMaxHp         = 100;
  var enemyCurrentHp      = 100;
  var enemyMaxHp          = 100;
  var playerXp            = 0;
  var playerLevel         = 1;
  var difficulty          = 1;
  var playerGold          = 0;

  updateStats();
  var newEnemy = new Enemy;

  function updateStats() {
    $('#player-health-bar').css('width', playerCurrentHp + '%')
    $('#player-hp').html('HP: ' + playerCurrentHp + ' / ' + playerMaxHp)
    $('#enemy-health-bar').css('width', enemyCurrentHp + '%')
    $('#enemy-hp').html('Enemy: ' + enemyCurrentHp + ' / ' + enemyMaxHp)
    $('#level').html('Level: ' + playerLevel)
    $('#xp-bar').html(playerXp + ' / ' + (1000 * (playerLevel * 2)))
  }

  function Enemy() {
    // this.name = Enemy.getName()
    this.hp   = 100;

    $('#enemy').on("click", Enemy.hitEnemy) 
  }

  Enemy.getName = function() {
    var enemyNames = [
                      "Xarg",
                      "Jerxag",
                      "Slath",
                      "Laoth",
                      "glatt"
                     ]
    return enemyNames[Math.floor(Math.random()*5)]
  }

  Enemy.hitEnemy = function() {
    console.log("enemy hit!")
    this.hp -= 10

    // updateStats()
    // if (enemyCurrentHp == 0) {
    //   // Kill enemy
    // }
  }

}