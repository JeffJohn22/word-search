var pos = [];
var click = { "startPos": "", "endPos": "" };
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
               "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var words = [
  { "word": "SAPIANS", "direction": "N" },
  { "word": "SLIMS", "direction": "SE" },
  { "word": "APPRECIATE", "direction": "NE" },
  { "word": "COFFEE", "direction": "S" },
  { "word": "MASTERY", "direction": "NW" },
  { "word": "ART", "direction": "E" },
  { "word": "SECURE", "direction": "E" },
  { "word": "PEOPLE", "direction": "S" },
  { "word": "SOOTHING", "direction": "W" },
  { "word": "FUN", "direction": "E" },
  { "word": "DARING", "direction": "S" },
  { "word": "CREDITS", "direction": "N" },
  { "word": "NEWS", "direction": "NW" },
  { "word": "GRIND", "direction": "W" },
  { "word": "BREW", "direction": "N" },
  { "word": "PLUGINS", "direction": "N" },
  { "word": "JAVA", "direction": "E" },
  { "word": "PYTHON", "direction": "NE" },
  { "word": "FUN", "direction": "NW" },
  { "word": "TRIAL", "direction": "S" },
];

// Function to calculate new start positions based on word length
function calculateStartPositions(words, gridSize) {
  for (var i = 0; i < words.length; i++) {
    var wordLength = words[i].word.length;
    var maxStartPos = gridSize - wordLength;

    var validStart = false;
    while (!validStart) {
      words[i].start = Math.floor(Math.random() * gridSize);
      validStart = validatePosition(words[i], gridSize);
    }
  }
}

function validatePosition(word, gridSize) {
  var wordLength = word.word.length;
  var start = word.start;
  var direction = word.direction;

  if (direction === "N") {
    return (start >= (wordLength - 1) * 20);
  }
  if (direction === "NE") {
    return (start % 20 + wordLength <= 20) && (start >= (wordLength - 1) * 19);
  }
  if (direction === "E") {
    return (start % 20 + wordLength <= 20);
  }
  if (direction === "SE") {
    return (start % 20 + wordLength <= 20) && (start <= gridSize - (wordLength * 21));
  }
  if (direction === "S") {
    return (start <= gridSize - (wordLength * 20));
  }
  if (direction === "SW") {
    return (start % 20 >= (wordLength - 1)) && (start <= gridSize - (wordLength * 19));
  }
  if (direction === "W") {
    return (start % 20 >= (wordLength - 1));
  }
  if (direction === "NW") {
    return (start % 20 >= (wordLength - 1)) && (start >= (wordLength - 1) * 21);
  }
  return false;
}

// Calculate the start positions for the words
var gridSize = 400; // Assuming a grid size of 400 for this example
calculateStartPositions(words, gridSize);

// Prepare the word search with random letters and word layout
$(document).ready(function () {
  // grab the size of the grid. I used this method in case I need to 
  // scale this word search in the future
  var size = gridSize;

  // put random letters on the board
  for (var i = 0; i < size; i++) {
    $(".letters").append("<span class='" + (i + 1) + "'>" +
      getRandomLetter() + "</span>");
  }

  // insert the words onto the board
  for (var i = 0; i < words.length; i++) {
    words[i].end = words[i].start;
    displayWord(words[i]);
    // save the start and end of each word for word checking later
    pos[i] = { "start": words[i].start, "end": words[i].end };
    $(".words").append("<span class='" + (i) + "'>" +
      words[i].word + "</span>");
  }

  $("#menu").on("mouseup", function () {
    $(this).css({ "display": "none" })
    $("#main").slideDown("slow", function () {
    })
  });
})

function getRandomLetter() {
  return letters[Math.floor(Math.random() * letters.length)];
}

function displayWord(w) {
  for (var j = 0; j < w.word.length; j++) {
    if (w.direction == "N") {
      $(".letters").find("." + w.end).text(w.word[j]);
      if (j + 1 != w.word.length) w.end -= 20;
    }
    if (w.direction == "NE") {
      $(".letters").find("." + w.end).text(w.word[j]);
      if (j + 1 != w.word.length) w.end -= 19;
    }
    if (w.direction == "E") {
      $(".letters").find("." + w.end).text(w.word[j]);
      if (j + 1 != w.word.length) w.end += 1;
    }
    if (w.direction == "SE") {
      $(".letters").find("." + w.end).text(w.word[j]);
      if (j + 1 != w.word.length) w.end += 21;
    }
    if (w.direction == "S") {
      $(".letters").find("." + w.end).text(w.word[j]);
      if (j + 1 != w.word.length) w.end += 20;
    }
    if (w.direction == "SW") {
      $(".letters").find("." + w.end).text(w.word[j]);
      if (j + 1 != w.word.length) w.end += 19;
    }
    if (w.direction == "W") {
      $(".letters").find("." + w.end).text(w.word[j]);
      if (j + 1 != w.word.length) w.end -= 1;
    }
    if (w.direction == "NW") {
      $(".letters").find("." + w.end).text(w.word[j]);
      if (j + 1 != w.word.length) w.end -= 21;
    }
  }
}

// start of x & y, end of x & y.  
var sX, sY, eX, eY, canvas, ctx, height, width, diff;
var r = 14;
var n = Math.sqrt((r * r) / 2);
var strokeColor = "black";
var isMouseDown = false;
var mouseMoved = false;

$(document).ready(function () {
  $("#c").on("mousedown mouseup mousemove mouseleave", function (e) {
    e.preventDefault();
    if (e.type == "mousedown") {
      setCanvas("c");
      isMouseDown = true;

      // Used for Firefox
      sX = e.offsetX || e.clientX - $(e.target).offset().left;
      sY = e.offsetY || e.clientY - $(e.target).offset().top;

      // Used for Chrome
      sX = e.clientX - $(e.target).offset().left;
      sY = e.clientY - $(e.target).offset().top;

      setPos(sX, sY, "start");

      drawCircle("mousedown");
    }
    if (e.type == "mouseup") {
      setCanvas("c");
      isMouseDown = false;

      // Used for Firefox
      eX = e.offsetX || e.clientX - $(e.target).offset().left;
      eY = e.offsetY || e.clientY - $(e.target).offset().top;

      // Used for Chrome
      eX = e.clientX - $(e.target).offset().left;
      eY = e.clientY - $(e.target).offset().top;

      setPos(eX, eY, "end");

      drawCircle("mouseup");

      // checks if the word highlighted is a word in the array list
      if (checkWord()) scratchWord();
      if (isEndOfGame()) alert("Game over!");
    }
    if (e.type == "mousemove") {
      if (isMouseDown) {
        setCanvas("a");

        // Used for Firefox
        eX = e.offsetX || e.clientX - $(e.target).offset().left;
        eY = e.offsetY || e.clientY - $(e.target).offset().top;

        // Used for Chrome
        eX = e.clientX - $(e.target).offset().left;
        eY = e.clientY - $(e.target).offset().top;

        drawCircle("mousemove");
      }
    }
    if (e.type == "mouseleave") {
      if (isMouseDown) {
        setCanvas("c");
        drawCircle("mouseleave");
      }
    }
  });
})

// draws the circles and lines
function drawCircle(f) {
  // the arc function does not draw a full circle so the difference
  // is calculated to complete the circle
  function drawArc(x, y, s, e) {
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * s, Math.PI * e, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }

  function drawLines(mX1, mY1, lX1, lY1, mX2, mY2, lX2, lY2) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = strokeColor;
    ctx.moveTo(mX1, mY1);
    ctx.lineTo(lX1, lY1);
    ctx.moveTo(mX2, mY2);
    ctx.lineTo(lX2, lY2);
    ctx.stroke();
  }

  // the start of the arc
  var sXa = sX + 2;
  var sYa = sY + 2;
  var eXa, eYa;

  if (f == "mousedown") {
    drawArc(sXa, sYa, .5, 1.5);
  }
  else if (f == "mousemove") {
    // clear the previous canvas and redraw the start arc and line
    ctx.clearRect(0, 0, width, height);
    drawArc(sXa, sYa, .5, 1.5);

    // the end of the arc
    eXa = eX + 2;
    eYa = eY + 2;

    diff = Math.abs(sX - eX);
    // draws the horizontal line
    if (sY == eY) {
      drawLines(sX, sY + r, eX, eY + r, sX, sY - r, eX, eY - r);
    }
    // draws the vertical line
    else if (sX == eX) {
      drawLines(sX + r, sY, eX + r, eY, sX - r, sY, eX - r, eY);
    }
    // draws the right diagonal
    else if (diff == Math.abs(sY - eY)) {
      drawLines(sX + n, sY + n, eX + n, eY + n, sX - n, sY - n, eX - n, eY - n);
    }
    // draws the left diagonal
    else if (diff == Math.abs(eY - sY)) {
      drawLines(sX - n, sY + n, eX - n, eY + n, sX + n, sY - n, eX + n, eY - n);
    }
  }
  else if (f == "mouseup") {
    // draws the last arc and line and clears the canvas for the next game
    eXa = eX + 2;
    eYa = eY + 2;
    drawArc(eXa, eYa, 1.5, .5);
    diff = Math.abs(sX - eX);
    if (sY == eY) {
      drawLines(sX, sY + r, eX, eY + r, sX, sY - r, eX, eY - r);
    }
    else if (sX == eX) {
      drawLines(sX + r, sY, eX + r, eY, sX - r, sY, eX - r, eY);
    }
    else if (diff == Math.abs(sY - eY)) {
      drawLines(sX + n, sY + n, eX + n, eY + n, sX - n, sY - n, eX - n, eY - n);
    }
    else if (diff == Math.abs(eY - sY)) {
      drawLines(sX - n, sY + n, eX - n, eY + n, sX + n, sY - n, eX + n, eY - n);
    }
  }
  else if (f == "mouseleave") {
    // if the mouse leaves the game area the canvas is cleared for the next
    // round
    ctx.clearRect(0, 0, width, height);
  }
}

// used to change the temporary canvas to the permanent one
function setCanvas(id) {
  canvas = document.getElementById(id);
  ctx = canvas.getContext("2d");
  width = canvas.width;
  height = canvas.height;
}

// called whenever the mouse button is pressed and the x and y coordinates
// are saved
function setPos(x, y, pos) {
  for (var i = 0; i < size; i++) {
    if (pos == "start") {
      if ($(".letters span").eq(i).position().top == y &&
        $(".letters span").eq(i).position().left == x) {
        click.startPos = i + 1;
      }
    }
    else {
      if ($(".letters span").eq(i).position().top == y &&
        $(".letters span").eq(i).position().left == x) {
        click.endPos = i + 1;
      }
    }
  }
}

// used to check if a word was highlighted and if it was that word is then
// scratched off the list
function checkWord() {
  for (var i = 0; i < pos.length; i++) {
    if (pos[i].start == click.startPos && pos[i].end == click.endPos) {
      pos.splice(i, 1);
      return true;
    }
  }
  return false;
}

// used to scratch a word off the list to the right
function scratchWord() {
  $("span." + i).css("text-decoration", "line-through");
}

// check if the game is over
function isEndOfGame() {
  return pos.length === 0;
}
