'use strict';

const MINE = '<img src="icons/mine.png"/>';
const EMPTY = '';

var gBoard;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
};

// isMarked: true

function init() {
    gBoard = bulidBoard(4);
    console.table(gBoard);
    renderBoard(gBoard);
}

function bulidBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false
            };
            if (i === 1 && j === 0 || i === 0 && j === 2) {
                board[i][j].isMine = true;
            }
        }
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
    if (!gGame.isOn) return;
    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true;
        renderBoard(gBoard);
    }
    if(gBoard[i][j].isMine){
        console.log('Game over');
        gGame.isOn = false;
        alert('Game over!');
    }
}

