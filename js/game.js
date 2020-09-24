'use strict';

const MINE = '<img width="40" height="40" src="icons/mine.png"/>';
const EMPTY = '';
const FLAG = '<img width="40" height="40" src="icons/flag-red-icon.png"/>'

var startTime = 0;
var clockInterval = null;

var gBoard;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesPositions: []
}

var gLevel = {
    SIZE: 4,
    MINES: 2
};


var noContext = document.getElementById('mineSweeper');

noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
    cellMarked(e.target);
});

function init() {
    gBoard = bulidBoard(gLevel.SIZE, gLevel.MINES);
    console.table(gBoard);
    renderBoard(gBoard);
}

function bulidBoard(size, minesNum) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false
            };

        }
    }

    fillMines(board, minesNum);


    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var cell = board[i][j];
            if (cell.isMine === true) {
                cell.minesAroundCount = -1;
                continue;
            }
            var count = setMinesNegsCount(board, i, j);
            cell.minesAroundCount = count;
        }
    }
    return board;
}

function fillMines(board, minesNum) {
    var mine = 0;
    while (mine < minesNum) {
        var randI = getRandomIntInclusive(0, board.length - 1);
        var randJ = getRandomIntInclusive(0, board.length - 1);
        if (!board[randI][randJ].isMine) {
            board[randI][randJ].isMine = true;
            mine++;
            gGame.minesPositions.push(
                {
                    row: randI,
                    col: randJ
                }
            )
        }
    }
}

function changeLevel(size, mines) {
    startTime = Date.now();
    clockInterval = setInterval(stopWatch, 1000);
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    resetGame();
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1 || i === rowIdx && j === colIdx) continue;
            var cell = board[i][j];
            if (cell.isMine === true) {
                count++;
            }
        }
    }
    return count;
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        return;
    }
    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].isShown) return;

    if (!startTime) {
        startTime = Date.now();
        clockInterval = setInterval(stopWatch, 1000);
    }

    if (gBoard[i][j].isMine) {
        elCell.classList.add('mine-open');
        gameOver();
    }
    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true;
        gGame.shownCount += 1;
        renderBoard(gBoard);
    }

    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard, i, j)
    }

    checkIfWin();
}

function cellMarked(elCell) {
    var cell = getPosFromElTd(elCell);
    if (!cell) return;
    if (!startTime) {
        startTime = Date.now();
        clockInterval = setInterval(stopWatch, 1000);
    }
    var i = cell[0];
    var j = cell[1];

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        gGame.markedCount += 1;
    } else {
        gBoard[i][j].isMarked = false;
        gGame.markedCount -= 1;
    }
    renderBoard(gBoard);
}

function expandShown(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1 || i === rowIdx && j === colIdx) continue;
            if (board[i][j].isMarked || board[i][j].isMine || board[i][j].isShown) continue;
            board[i][j].isShown = true;
            gGame.shownCount++;
        }
    }
    renderBoard(gBoard);
}

function gameOver() {
    var gameOverMsg = document.querySelector('.game-over');
    gameOverMsg.style.display = "block";
    var smileyImg = document.querySelector('.smiley');
    smileyImg.src = "icons/sad-smiley.png";
    gGame.isOn = false;
    clearStopWatch();

    for (var i = 0; i < gGame.minesPositions.length; i++) {
        var pos = gGame.minesPositions[i];
        gBoard[pos.row][pos.col].isShown = true;
    }
    renderBoard(gBoard);
}
// if all mines are marked and all cells are shown

function checkIfWin() {
    if ((gGame.shownCount === (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES) && (gLevel.MINES === gGame.markedCount)) {
        alert('You win!')
    }
}



function resetGame() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        minesPositions: []
    }
    clockInterval = 0;
    startTime = 0;
    var gameOverMsg = document.querySelector('.game-over');
    gameOverMsg.style.display = "none";
    var smileyImg = document.querySelector('.smiley');
    smileyImg.src = "icons/smiley1.png";
    document.querySelector('.stop-watch').innerHTML = 0;
    init();
}

function stopWatch() {
    var currTime = Date.now() - startTime;
    document.querySelector('.stop-watch').innerHTML = Math.floor(currTime / 1000);
    gGame.secsPassed = Math.floor(currTime / 1000);
}

function clearStopWatch() {
    clearInterval(clockInterval);
}