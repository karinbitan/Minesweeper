'usestrict';


function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        var row = board[i];
        for (var j = 0; j < row.length; j++) {
            var posStr = i + '-' + j;
            var openClass = gBoard[i][j].isShown ? 'open' : '';
            var cellClass = 'cell cell' + i + '-' + j;

            var cellValue = EMPTY;
            var count = board[i][j].minesAroundCount;


            if (!board[i][j].isShown) {
                cellValue = EMPTY;
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

function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


function getPosFromElTd(elTd) {
    var dataSet = elTd.dataset;
    var posStr = dataSet.pos;
    var splitted = posStr.split('-');
    var pos = { i: +splitted[0], j: +splitted[1] };
    return pos;
}