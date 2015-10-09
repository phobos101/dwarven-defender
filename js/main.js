//--------------------------------------
//                START
//--------------------------------------
$(start)

function start() {
  var curNum = 0
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

  
}