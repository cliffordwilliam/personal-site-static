// words here refer to numbers from 0 to 3, sentences are sequences of numbers
// talk means to glow a button, one button glow is one talk action

// references
const SIMON_BUTTON_CONTAINER = document.querySelector(
  ".simon-button-container"
);
const SIMON_BUTTONS = document.querySelectorAll(".simon-button");
const GAME_STATE_HEADING = document.querySelector(".game-state-heading");
const START_BUTTON = document.querySelector(".start-button");

// vars for sentences
let sentence = []; // store all words history from start of game
let duplicateSentence; // to pop out one by one when reading

// game play
let state = 0;
let score = 0;

// delay between talking
const DELAY = 500; // 0.5 second gap

function disableButtons() {
  // prevent clicking
  for (let i = 0; i < SIMON_BUTTONS.length; i++) {
    const button = SIMON_BUTTONS[i];
    // remove signal
    button.removeEventListener("click", onPlayerClick);
    // disable
    button.classList.add("disabled");
  }
}

function enableButtons() {
  // allow clicking
  for (let i = 0; i < SIMON_BUTTONS.length; i++) {
    const button = SIMON_BUTTONS[i];
    button.addEventListener("click", onPlayerClick);
    button.classList.remove("disabled");
  }
}

function addWord() {
  // add word to sentence
  let randNum = get_random_number(3);
  sentence.push(randNum);
  // create a shallow copy of the sentence array
  duplicateSentence = [...sentence];
  // talk after 1s
  setTimeout(talk, DELAY);
  // update heading, talking
  set_state(1);
}

function talk() {
  // pop the first word
  let number = duplicateSentence.shift();
  // grab the associated button with word
  let currentButton = SIMON_BUTTON_CONTAINER.children[number];
  // glow the selected button (this play the blink animation)
  currentButton.classList.add("blink");
  // attach animation signal to current button
  currentButton.addEventListener("animationend", onBlinkAnimationEnd);
  // play sound
  stopAndPlay(SCROLLING_SFX);

  // after blink animation
  function onBlinkAnimationEnd() {
    // detach signal
    currentButton.removeEventListener("animationend", onBlinkAnimationEnd);
    // remove animation class
    currentButton.classList.remove("blink");
    // still have words to say?
    if (duplicateSentence.length > 0) {
      // talk
      setTimeout(talk, DELAY);
    } else {
      // player turn
      enableButtons();
      // create a shallow copy of the sentence array
      duplicateSentence = [...sentence];
      // update heading, player turn
      set_state(2);
    }
  }
}

function onPlayerClick() {
  // pop the first word
  let number = duplicateSentence.shift();
  // correct click?
  if (this.id === number.toString()) {
    stopAndPlay(CLICK_SFX);
    // no more words?
    if (duplicateSentence.length === 0) {
      // add score, simon turn
      score += 1;
      disableButtons();
      addWord();
    }
    // wrong click?
  } else {
    // back to waiting
    waiting();
    stopAndPlay(BACK_SFX);
  }
}

function get_random_number(value) {
  // return random number from 0 to given value
  return Math.floor(Math.random() * value + 1);
}

function waiting() {
  // enable the start button
  START_BUTTON.classList.remove("disabled");
  // attach start button signal
  START_BUTTON.addEventListener("click", onStartButtonClick);
  // update state, waiting
  set_state(0);
}

function onStartButtonClick() {
  // play sound
  stopAndPlay(CLICK_SFX);
  // disable the start button
  START_BUTTON.classList.add("disabled");
  // detach start button signal
  START_BUTTON.removeEventListener("click", onStartButtonClick);
  // add word, start game
  disableButtons();
  addWord();
}

function set_state(value) {
  old_state = state;
  state = value;

  // ENTRY

  // handle waiting state
  if (state === 0) {
    // from player turn
    if (old_state === 2) {
      GAME_STATE_HEADING.textContent =
        "Wrong! Your score is: " +
        score +
        "! Press the start button to play again.";
      // reset the game
      sentence = [];
      disableButtons();
      score = 0;
      // from first time starting the game
    } else if (old_state === 0) {
      GAME_STATE_HEADING.textContent = "Click the start button to play.";
    }

    // handle talking state
  } else if (state === 1) {
    // from waiting
    if (old_state === 0) {
      GAME_STATE_HEADING.textContent = "Remember the sequence.";
      // from player turn
    } else if (old_state === 2) {
      GAME_STATE_HEADING.textContent = "Correct! Remember the next sequence.";
    }

    // handle player state
  } else if (state === 2) {
    GAME_STATE_HEADING.textContent = "Repeat the sequence.";
  }
}

// initialize
disableButtons();
waiting();

// cycle
// waiting > addWord > talk > onPlayerClick > |- addWord
//                                            |- waiting

// grab the sounds
const SCROLLING_SFX = new Audio("sounds/scrolling.mp3");
const CLICK_SFX = new Audio("sounds/click.mp3");
const BACK_SFX = new Audio("sounds/back.mp3");

// the only way you enter a new page is from buttons
// so play the click button on entry to a new page (this page)
stopAndPlay(CLICK_SFX);

function stopAndPlay(audio) {
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0; // reset audio to the beginning
  }
  audio.play();
}
