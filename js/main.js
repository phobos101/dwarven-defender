//--------------------------------------
//                START
//--------------------------------------
$(start)

function start() {
  var curNum              = 0
  var playerCurrentHp     = 100;
  var playerMaxHp         = 100;
  var playerXp            = 0;
  var playerLevel         = 1;
  var difficulty          = 1;
  var playerGold          = 0;

  updateStats();
  setInterval(displayNextImage, 1000);

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
    $('#enemy-hp').html('Enemy: ' + 100 + ' / ' + 100)
    $('#level').html('Level: ' + playerLevel)
    $('#xp-bar').html(playerXp + ' / ' + (1000 * (playerLevel * 2)))
  }

}