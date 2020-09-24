'usestrict';


function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        var row = board[i];
        for (var j = 0; j < row.length; j++) {
            var posStr = i + '-' + j;
            var openClass = gBoard[i][j].isShown ? 'open' : '';
            var mineClass = gBoard[i][j].isMine ? 'mine' : '';
            var cellClass = 'cell cell' + i + '-' + j;

            var cellValue = EMPTY;
            var count = board[i][j].minesAroundCount;


            if (!board[i][j].isShown) {
                cellValue = EMPTY;
                if (board[i][j].isMarked) {
                    cellValue = FLAG;
                } else {
                    cellValue = EMPTY;
                }
            }
            else {
                if (count === 0) {
                    cellValue = EMPTY
                } else if (board[i][j].isMine) {
                    cellValue = MINE;
                } else {
                    cellValue = count;
                }
            }


            strHtml += `<td onclick="cellClicked(this, ${i}, ${j})" data-pos="${posStr}" class="${cellClass} ${openClass}">${cellValue}</td>`;

        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}


// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


function getPosFromElTd(elm) {
    var pos = elm.getAttribute('data-pos') || elm.parentElement.getAttribute('data-pos');
    if (!pos) return null;
    var splited = pos.split('-');
    return splited;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value
}