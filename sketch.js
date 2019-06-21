let wordnikStart = 'https://api.wordnik.com/v4/';
let wordnikRandomAPI =
  'words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=';
let wordnikDefAPI =
  '/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false';
let key = '&api_key=e27d087b090f25aaf860402eff4033c68161312a5891b5388';
let hidden = [];
let word = '';
let displayed = '';
let definition = '';
let crosses = '';
let loaded = false;
let hints = false;
let started = false;
let maxlen;
let mistakes;

function setup() {
  createCanvas(windowWidth, windowHeight);
  maxlen = floor(width / 130);

  getWord();
}

function getWord() {
  started = true;
  mistakes = 0;
  loadJSON(wordnikStart + wordnikRandomAPI + maxlen + key, gotWord);
}

function gotDefinition(data) {
  let def = data[0].text || 'No hint available';
  var n = def.search(/\.|;|:/);
  def = def.substring(0, n != -1 ? n : def.length);
  definition += def.replace(/<\/?[^>]+(>|$)/g, '');
}

function gotWord(data) {
  word = data.word;
  if (word.indexOf('-') > 0 || word.indexOf(' ') > 0) {
    loadJSON(wordnikStart + wordnikRandomAPI + maxlen + key, gotWord);
  } else {
    loadJSON(
      wordnikStart + 'word.json/' + word + wordnikDefAPI + key,
      gotDefinition
    );
    prepareWord();
  }
}

function prepareWord() {
  word = word
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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
  textSize(height / 9);
  text('GAME OVER', width / 2, height / 3);
  textSize(height / 14);
  text('The word was: ' + word, width / 2, (2 * height) / 3);
  textSize(height / 16);
  text('Press SPACE or ENTER to play again', width / 2, (2 * height) / 3 + 66);
}

function gameWon() {
  started = false;
  background(0);
  textSize(height / 9);
  text('YOU WON', width / 2, height / 3);
  textSize(height / 14);
  text(word, width / 2, (2 * height) / 3);
  textSize(height / 16);
  text('Press SPACE or ENTER to play again', width / 2, (2 * height) / 3 + 66);
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
      hints = !hints;
    }
  }
  if (!started) {
    if (keyCode === 32 || keyCode === ENTER) {
      crosses = '';
      displayed = '';
      hidden = [];
      definition = '';
      getWord();
    }
  }
}

function playing() {
  textSize(height / 30);
  if (hints)
    text(
      'Press 1 deactivate hints\nHints appear after the third mistake',
      width / 2,
      height / 8
    );
  else text('Press 1 activate hints', width / 2, height / 8);
  textSize(height / 14);
  text(crosses, width / 2, height / 2);
  textSize(height / 9);
  text(displayed, width / 2, (2 * height) / 3);
  rectMode(CORNER);
  textSize(map(definition.length / 3.6, 0, 100, 100, 0));
  if (mistakes > 2 && hints)
    text('Hint: ' + definition, 20, (2 * height) / 3 + 100, width - 20);
}

function draw() {
  background(0);
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(height / 20);
  text('HANGMAN', width / 2, height / 16);
  if (started) playing();
  else if (mistakes > 5) gameOver();
  else gameWon();
}
