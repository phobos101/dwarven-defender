//--------------------------------------
//                START
//--------------------------------------
$(start)

function start() {
  var curNum              = 0
  var playerCurrentHp     = 70;
  var playerMaxHp         = 100;
  var playerCurrentEnergy = 10;
  var playerMaxEnergy     = 10;
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
    $('#player_hp').html('HP: ' + playerCurrentHp + ' / ' + playerMaxHp)
    $('#player_energy').html('Energy: ' + playerCurrentEnergy + ' / ' + playerMaxEnergy)
    $('#level').html('Level: ' + playerLevel)
    $('#xp_bar').html(playerXp + ' / ' + (1000 * (playerLevel * 2)))
  }

}