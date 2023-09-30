const SOUND_BUTTONS = document.querySelectorAll(".sound-btn");
const SCROLLING_SFX = new Audio("sounds/scrolling.mp3");
const CLICK_SFX = new Audio("sounds/click.mp3");
const BACK_SFX = new Audio("sounds/back.mp3");

function stopAndPlay(audio) {
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0; // reset audio to the beginning
  }
  audio.play();
}

// the only way you enter a new page is from buttons
stopAndPlay(CLICK_SFX);

SOUND_BUTTONS.forEach(function (button) {
// connect mouseenter event listener
button.addEventListener("mouseenter", function () {
    stopAndPlay(SCROLLING_SFX);
});

// connect click event listener
button.addEventListener("click", function () {
    if (button.classList.contains("cancel") === true) {
    stopAndPlay(BACK_SFX);
    } else if (button.classList.contains("cancel") === false) {
    stopAndPlay(CLICK_SFX);
    }
});
});
