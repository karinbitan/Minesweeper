'use strict';

const MINE = '<img width="16" height="16" src="icons/mine.png"/>';
const EMPTY = '';
const FLAG = '<img width="16" height="16" src="icons/flag-red-icon.png"/>'

var startTime = 0;
var clockInterval = null;

var gBoard;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesPositions: [],
    lives: 3,
    hintsCount: 3,
    isHintOn: false,
    safeClickCount: 3,
    manual: false
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LEVEL_NAME: 'Easy'
};


var noContext = document.getElementById('mineSweeper');

noContext.addEventListener('contextmenu', e => {
    e.preventDefault();
    cellMarked(e.target);
});

function init() {
    gBoard = bulidBoard(gLevel.SIZE, 0);
    console.table(gBoard);
    renderBoard(gBoard);
    document.querySelector('.lives').innerHTML = gGame.lives;
    showBestScore();
}

function bulidBoard(size, minesNum, cellWithoutMine) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false,
                isShownByHint: false,
                isMarked: false,
                isSafe: false
            };

        }
    }
    if (!gGame.manual) {
        fillRandomMines(board, minesNum, cellWithoutMine);
    } else {
        fillManualMines(board);
    }


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

function fillRandomMines(board, minesNum, cellWithoutMine) {
    var mine = 0;
    while (mine < minesNum) {
        var randI = getRandomInt(0, board.length);
        var randJ = getRandomInt(0, board.length);
        if (cellWithoutMine) {
            if (cellWithoutMine.row == randI && cellWithoutMine.col == randJ) continue;
        }

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


function fillManualMines(board) {
    for (var i = 0; i < gGame.minesPositions.length; i++) {
        var currMine = gGame.minesPositions[i];
        board[currMine.row][currMine.col].isMine = true;
    }
}


function changeLevel(size, mines, levelName) {
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    gLevel.LEVEL_NAME = levelName;
    document.querySelector('.manual').innerText = 'Click here for manual mode';
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


    if (gGame.manual && gGame.minesPositions.length !== gLevel.MINES) {
        gGame.minesPositions.push(
            {
                row: i,
                col: j
            }
        );
        gBoard[i][j].isMine = true;
        gBoard[i][j].isShown = true;
        renderBoard(gBoard);
        if (gGame.minesPositions.length == gLevel.MINES) {
            setTimeout(function () {
                for (let i = 0; i < gGame.minesPositions.length; i++) {
                    gBoard[gGame.minesPositions[i].row][gGame.minesPositions[i].col].isShown = false;
                }
                document.querySelector('.manual-use').style.display = "none";
                document.querySelector('.manual').innerText = 'You filled the mines! You can play :)'
                document.querySelector('.manual').style.display = "block";
                renderBoard(gBoard);
            }, 1000)
        }
        return;
    }




    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].isShown) return;

    if (!startTime) {
        startTime = Date.now();
        clockInterval = setInterval(stopWatch, 1000);
        gBoard = bulidBoard(gLevel.SIZE, gLevel.MINES, { row: i, col: j });
    }

    if (gGame.isHintOn) {
        showHint(i, j);
        return;
    }

    if (gBoard[i][j].isMine) {
        if (gGame.lives > 1) {
            gGame.lives--;
            gGame.shownCount -= 1;
            var audioLostLife = new Audio('sounds/lost_life.mp3');
            audioLostLife.play();
            setTimeout(function () {
                gBoard[i][j].isShown = false;
                renderBoard(gBoard);

            }, 2000)

            document.querySelector('.lives').innerHTML = gGame.lives;
        }
        else {
            gGame.lives--;
            elCell.classList.add('mine-open');
            document.querySelector('.lives').innerHTML = gGame.lives;
            gameOver();
            return;
        }
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
    checkIfWin();
}


function manualMode(el) {
    if (gGame.manual) return
    gGame.manual = true;
    el.style.display = "none";
    document.querySelector('.manual-use').style.display = "block";
}


function gameOver() {
    document.querySelector('.smiley').src = "icons/sad-smiley.png";
    var audioGameOver = new Audio('sounds/game_over.mp3');
    audioGameOver.play();
    gGame.isOn = false;
    clearStopWatch();

    for (var i = 0; i < gGame.minesPositions.length; i++) {
        var pos = gGame.minesPositions[i];
        gBoard[pos.row][pos.col].isShown = true;
    }
    renderBoard(gBoard);
}


function checkIfWin() {
    if ((gGame.shownCount == (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES) && (gLevel.MINES == gGame.markedCount)) {
        var smileyImg = document.querySelector('.smiley');
        var audioWin = new Audio('sounds/win_sound.mp3');
        audioWin.play();
        smileyImg.src = "icons/cool-icon.png";
        saveBestScore(startTime);
        showBestScore();
        clearStopWatch();
    }
}


function resetGame() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        minesPositions: [],
        lives: 3,
        hintsCount: 3,
        safeClickCount: 3
    }
    clearStopWatch();
    document.querySelector('.smiley').src = 'icons/smiley1.png';
    init();
}


function getHint(elImg) {
    if (startTime !== 0) {
        if (!gGame.isHintOn) {
            elImg.src = 'icons/hint-use.jpg';
            elImg.classList.add('used');
            gGame.isHintOn = true;
            gGame.hintsCount -= 1;
        } else if (gGame.isHintOn) {
            elImg.src = 'icons/hint.jpg';
            elImg.classList.remove('used');
            gGame.isHintOn = false;
            gGame.hintsCount += 1;
        }
    }
}

function expandShown(board, rowIdx, colIdx, hintDisabled = false) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board.length - 1 || i === rowIdx && j === colIdx) continue;
            if (!gGame.isHintOn) {
                if (board[i][j].isMarked || board[i][j].isMine || board[i][j].isShown) continue;
                board[i][j].isShown = true;
                gGame.shownCount++;
            } else {
                if (!hintDisabled) {
                    if (board[i][j].isShown === false) {
                        board[i][j].isShown = true;
                        board[i][j].isShownByHint = true;
                    }
                } else {
                    if (board[i][j].isShownByHint === true) {
                        board[i][j].isShown = false;
                        board[i][j].isShownByHint = false;
                    }
                }

            }
        }
        renderBoard(gBoard);
    }
}

function showHint(i, j) {
    gBoard[i][j].isShown = true;
    expandShown(gBoard, i, j);
    setTimeout(function () {
        gBoard[i][j].isShown = false;
        expandShown(gBoard, i, j, true);
        renderBoard(gBoard);
        gGame.isHintOn = false;
        document.querySelector('.hint.used').style.visibility = "hidden";
        document.querySelector('.hint.used').classList.remove('used');
    }, 1000)
}

function safeClick() {
    if (startTime !== 0) {
        var randI = getRandomInt(0, gLevel.SIZE);
        var randJ = getRandomInt(0, gLevel.SIZE);
        if (gGame.safeClickCount > 0) {
            if (!gBoard[randI][randJ].isMine && !gBoard[randI][randJ].isMarked && !gBoard[randI][randJ].isShown) {
                gBoard[randI][randJ].isSafe = true;
                gGame.safeClickCount -= 1;
                renderBoard(gBoard);
                setTimeout(function () {
                    gBoard[randI][randJ].isSafe = false;
                    renderBoard(gBoard);
                    document.querySelector('.safe-click-num').innerText -= 1;
                }, 2000)
            }
        } else {
            return;
        }
    }
}

function saveBestScore(startTime) {
    var endTime = Date.now() - startTime;
    var bestScore = localStorage.getItem(`best-score-${gLevel.LEVEL_NAME}`);
    if (!bestScore) {
        localStorage.setItem(`best-score-${gLevel.LEVEL_NAME}`, endTime);
    } else if (endTime < bestScore) {
        localStorage.setItem(`best-score-${gLevel.LEVEL_NAME}`, endTime);
    }
}

function showBestScore() {
    var bestScore = localStorage.getItem(`best-score-${gLevel.LEVEL_NAME}`);
    document.querySelector('.best-score').innerHTML = Math.floor(bestScore / 1000);
}


function stopWatch() {
    var currTime = Date.now() - startTime;
    document.querySelector('.stop-watch').innerHTML = Math.floor(currTime / 1000);
    gGame.secsPassed = Math.floor(currTime / 1000);
}

function clearStopWatch() {
    clearInterval(clockInterval);
    clockInterval = null;
    startTime = 0;
    document.querySelector('.stop-watch').innerHTML = 0;
}