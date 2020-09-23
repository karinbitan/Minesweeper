'use strict';

const MINE = '<img src="icons/mine.png"/>';
const EMPTY = '';

var gBoard;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// minesAroundCount: 4,
// isMine: false,
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
            var count = setMinesNegsCount(board, i, j);
            if (cell.isMine === true) continue;
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

// function cellClicked(elCell) {
//     if (!gGame.isOn) return;
//     if (elCell.isMine) continue;
//     if(elCell.innerText = EMPTY){

//     }
//     if(elCell.innerText = )

// }

