'usestrict';


function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        var row = board[i];
        for (var j = 0; j < row.length; j++) {
            var posStr = i + '-' + j;
            var openClass = gBoard[i][j].isShown ? 'open' : '';
            var mineClass = gBoard[i][j].isMine && gBoard[i][j].isShown ? 'mine' : '';
            var safeClickClass = gBoard[i][j].isSafe && !gBoard[i][j].isShown  ? 'safe' : '';
            var cellClass = 'cell cell' + i + '-' + j;

            var cellValue = EMPTY;
            var count = board[i][j].minesAroundCount;
            var countClass = null;
            if (count === 1){
                countClass = 'blue';
            } else if (count === 2){
                countClass = 'green';
            } else if (count === 3){
                countClass = 'red';
            }


            if (!board[i][j].isShown) {
                cellValue = EMPTY;
                if (board[i][j].isMarked) {
                    cellValue = FLAG;
                } else {
                    cellValue = EMPTY;
                }
            }
            else {
                if (board[i][j].isMine) {
                    cellValue = MINE;
                } else if (count === 0) {
                    cellValue = EMPTY
                } else {
                    cellValue = count;
                }
            }


            strHtml += `<td onclick="cellClicked(this, ${i}, ${j})" data-pos="${posStr}"
             class="${cellClass} ${openClass} ${mineClass} ${countClass} ${safeClickClass}">${cellValue}</td>`;

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


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

