let flags = 0;
let bombAmount = 20;
let isGameOver = false;
var specialMp3;
var clickMp3;
var flagMp3;
var dropFlagMp3;

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;


    let squares = [];


    //randomizes
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    //creates sound object
      function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }    
    }

    //create Board
    function createBoard() {
        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        let shuffledArray = shuffle(gameArray);
        for (let i = 0; i < width*width; i++) {
            //creates element with an unique id assigns valid or bomb class to it adds the square to the grid query selected element and the squares array
            //after adds an event listener to that object
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            if (i<=9) {
              square.classList.add('row1');
            } else if (i<=19) {
              square.classList.add('row2');
            } else if (i<=29) {
              square.classList.add('row3');
            } else if (i<=39) {
              square.classList.add('row4');
            } else if (i<=49) {
              square.classList.add('row5');
            } else if (i<=59) {
              square.classList.add('row6');
            } else if (i<=69) {
              square.classList.add('row7');
            } else if (i<=79) {
              square.classList.add('row8');
            } else if (i<=89) {
              square.classList.add('row9');
            } else if (i<=99) {
              square.classList.add('row10');
            }
            square.style.gridRowStart = 3;
            grid.appendChild(square);
            squares.push(square);
            
            //normal click
            square.addEventListener('click', function(e) {
                click(square);
            });

            //right click
            square.oncontextmenu = function(e) {
              e.preventDefault();
              addFlag(square);
              console.log('right clicked');
            }
        }

        //add numbers

        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = i % width === 0;
            const isRightEdge = i % width === width -1;

            if (squares[i].classList.contains('valid') ) {
                //west
                if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total++;
                //north-east
                if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total++;
                //north
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
                //north-west
                if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total++;
                //east
                if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total++;
                //south-west
                if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total++;
                //south-east
                if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total++;
                //south
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
                //console.log(squares[i]);
            }
        }
    }

    //add audio
    function addAudio() {
    clickMp3 = new sound("click.mp3");    
    flagMp3 = new sound("flag.mp3");
    dropFlagMp3 = new sound("dropFlag.mp3");
    specialMp3 = new sound("special.mp3");
    }

    addAudio();
    createBoard();


    //add flag with right click
    function addFlag(square) {
      if (isGameOver) return;
      if (flags < bombAmount && !square.classList.contains('checked') && !square.classList.contains('flag')) {
        flagMp3.play();
        square.classList.add('flag');
        square.innerHTML = 'flag';
        flags++;
        } else {
          dropFlagMp3.play();
          square.classList.remove('flag');
          square.innerHTML = '';
          flags--;
        }

        if (flags > bombAmount) {
          dropFlagMp3.play();
          square.classList.remove('flag');
          square.innerHTML = '';
          flags--;
        }
    }

    //click on square actions
    function click(square) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) gameOver();
        else {
            clickMp3.play();
            let total = square.getAttribute('data');
            if (total > 0) {
              square.classList.add('checked');
              square.innerHTML = total;
              checkForWin();
              return;
            }
            clickMp3.stop();
            specialMp3.play();
            checkSquare(square, currentId)
        }
        square.classList.add('checked');
    }

//check neighboring squares once square is clicked
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width -1)

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
          const newId = parseInt(currentId) - 1;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
        if (currentId > 9 && !isRightEdge) {
          const newId = parseInt(currentId) +1 -width;
          const newSquare = document.getElementById(newId);
          click(newSquare)
        }
        if (currentId > 10) {
          const newId = parseInt(currentId) -width;
          const newSquare = document.getElementById(newId);
          click(newSquare)
        }
        if (currentId > 11 && !isLeftEdge) {
          const newId = parseInt(currentId) -1 -width;
          const newSquare = document.getElementById(newId);
          click(newSquare)
        }
        if (currentId < 98 && !isRightEdge) {
          const newId = parseInt(currentId) +1;
          const newSquare = document.getElementById(newId);
          click(newSquare)
        }
        if (currentId < 90 && !isLeftEdge) {
          const newId = parseInt(currentId) -1 +width;
          const newSquare = document.getElementById(newId);
          click(newSquare)
        }
        if (currentId < 88 && !isRightEdge) {
          const newId = parseInt(currentId) +1 +width;
          const newSquare = document.getElementById(newId);
          click(newSquare)
        }
        if (currentId < 89) {
          const newId = parseInt(currentId) +width;
          const newSquare = document.getElementById(newId);
          click(newSquare);
        }
      }, 10)
}

//game over
function gameOver(square)
{
  console.log('BOOM! Game Over!');
  isGameOver = true;

  //show all the bombs
  squares.forEach(square => {
    if (square.classList.contains('bomb')) {
      square.innerHTML = 'bomb';
    }
  });
}

//check for win
function checkForWin() {
  let checked = 0;
  for (let i = 0; i < squares.length; i++) if (squares[i].classList.contains('checked')) checked++;
  if (checked === width*width - bombAmount) {
    isGameOver = true;
    console.log('YOU WIN!');
  }
}


})