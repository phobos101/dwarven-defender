//--------------------------------------
//                START
//--------------------------------------
$(start)

function start() {
  var curNum = 0
  var player_current_hp = 10;
  var player_max_hp = 10;
  var player_current_energy = 10;
  var player_max_energy = 10;
  var player_xp = 0;
  var player_level = 1;
  var difficulty = 1;
  var player_gold = 0;

  updateTop();
  setInterval(displayNextImage, 1000);

  function displayNextImage() {
    if (curNum === 0) {
      $('#content').css("background-image", "url('assets/background1.png')")
      curNum = 1;
    }
    else {
      $('#content').css("background-image", "url('assets/background2.png')")
      curNum = 0;
    } 
  }

  function updateTop() {
    $("#player_hp").html("HP: " + player_current_hp + " / " + player_max_hp)
    $("#player_energy").html("Energy: " + player_current_energy + " / " + player_max_energy)
    $("#level").html("Level: " + player_level)
    $("#xp_bar").html(player_xp + " / " + (1000 * (player_level * 2)))
  }

}