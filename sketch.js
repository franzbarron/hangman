let wordnikStart = 'https://api.wordnik.com/v4/';
let wordnikRandomAPI =
    'words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=15&api_key=';
let wordnikDefAPI =
    '/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=';
let key = 'e27d087b090f25aaf860402eff4033c68161312a5891b5388';
let hidden = [];
let word = '';
let displayed = '';
let definition = '';
let crosses = '';
let loaded = false;
let hints = false;
let started = false;
let mistakes;

function setup() {
  createCanvas(windowWidth, windowHeight - 10);
  getWord();
}

function getWord() {
  started = true;
  mistakes = 0;
  loadJSON(wordnikStart + wordnikRandomAPI + key, gotWord);
}

function gotDefinition(data) {
  definition += data[0].text;
}

function gotWord(data) {
  word = data.word;
  loadJSON(
      wordnikStart + 'word.json/' + word + wordnikDefAPI + key, gotDefinition);
  if (word.indexOf('-') > 0 || word.indexOf(' ') > 0) {
    loadJSON(wordnikStart + wordnikRandomAPI + key, gotWord);
  } else {
    prepareWord();
  }
}

function prepareWord() {
  word = word.toUpperCase();
  loaded = true;
  for (let i = 0; i < word.length; i++) {
    hidden.push('_');
    hidden.push(' ');
  }
  for (let i = 0; i < hidden.length; i++) {
    displayed += hidden[i];
  }
}

function gameOver() {
  started = false;
  background(0);
  textSize(108);
  text('GAME OVER', width / 2, height / 3);
  textSize(72)
  text('The word was: ' + word, width / 2, 2 * height / 3);
  textSize(60);
  text('Press SPACE to play again', width / 2, 2 * height / 3 + 66);
}

function gameWon() {
  started = false;
  background(0);
  textSize(108);
  text('YOU WON', width / 2, height / 3);
  textSize(72)
  text(word, width / 2, 2 * height / 3);
  textSize(60);
  text('Press SPACE to play again', width / 2, 2 * height / 3 + 66);
}

function keyPressed() {
  let change = false;
  if (loaded && started) {
    if (keyCode >= 65 && keyCode <= 90) {
      for (let i = 0; i < word.length; i++) {
        if (keyCode === word.charCodeAt(i)) {
          change = true;
          hidden[i * 2] = word[i];
        }
      }
      if (change) {
        displayed = '';
        for (let i = 0; i < hidden.length; i++) {
          displayed += hidden[i];
        }
        if (displayed.indexOf('_') < 0) gameWon();
      } else {
        mistakes++;
        crosses += 'X ';
        if (mistakes > 5) {
          gameOver();
        }
      }
    } else if (keyCode === 49 || keyCode === 97) {
      if (hints)
        hints = false;
      else
        hints = true;
    }
  }
  if (!started) {
    if (keyCode === 32) {
      crosses = '';
      displayed = '';
      hidden = [];
      definition = '';
      getWord();
    }
  }
}

function playing() {
  textSize(32);
  if (hints)
    text('Press 1 deactivate hints', width / 2, 112);
  else
    text('Press 1 activate hints', width / 2, 112);
  textSize(72);
  text(crosses, width / 2, height / 2);
  textSize(108);
  text(displayed, width / 2, 2 * height / 3);
  textSize(56);
  if (mistakes > 2 && hints)
    text('Hint:\n' + definition, width / 2, 2 * height / 3 + 96);
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(48);
  text('HANGMAN', width / 2, 72);
  if (started)
    playing();
  else if (mistakes > 5)
    gameOver();
  else
    gameWon();
}
