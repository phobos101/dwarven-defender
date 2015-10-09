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
  setInterval(displayNextImage, 1000);

  var $enemy = $('#enemy').on("click", hitEnemy) 

  function displayNextImage() {
    if (curNum === 0) {
      $('#content').css('background-image', 'url("assets/background1.png")')
      curNum = 1;
    }
    else {
      $('#content').css('background-image', 'url("assets/background2.png")')
      curNum = 0;
    } 
  }

  function updateStats() {
    $('#player-health-bar').css('width', playerCurrentHp + '%')
    $('#player-hp').html('HP: ' + playerCurrentHp + ' / ' + playerMaxHp)
    $('#enemy-health-bar').css('width', enemyCurrentHp + '%')
    $('#enemy-hp').html('Enemy: ' + enemyCurrentHp + ' / ' + enemyMaxHp)
    $('#level').html('Level: ' + playerLevel)
    $('#xp-bar').html(playerXp + ' / ' + (1000 * (playerLevel * 2)))
  }

  function hitEnemy() {
    console.log("enemy hit!")
    enemyCurrentHp -= 10
    updateStats()
  }

}