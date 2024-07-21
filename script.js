const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let turn = 'white';
const chessboard = document.getElementById('chessboard');
let selectedPiece = null;
let selectedSquare = null;

function createBoard() {
    chessboard.innerHTML = ''; // Tahtayı sıfırla
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;

            if (initialBoard[row][col]) {
                const piece = document.createElement('div');
                piece.className = 'piece';
                piece.innerText = pieces[initialBoard[row][col]];
                piece.dataset.row = row;
                piece.dataset.col = col;
                piece.dataset.color = initialBoard[row][col] === initialBoard[row][col].toUpperCase() ? 'white' : 'black';
                square.appendChild(piece);

                piece.addEventListener('click', () => selectPiece(piece));
            }

            square.addEventListener('click', () => movePiece(square));
            chessboard.appendChild(square);
        }
    }
}

function selectPiece(piece) {
    if (selectedPiece) {
        selectedPiece.style.backgroundColor = '';
    }
    if (turn !== piece.dataset.color) {
        return;
    }
    selectedPiece = piece;
    selectedPiece.style.backgroundColor = 'yellow';
    selectedSquare = piece.parentElement;
}

function movePiece(square) {
    if (selectedPiece && square !== selectedSquare && isValidMove(selectedSquare, square)) {
        const targetPiece = square.firstChild;
        if (targetPiece) {
            if (targetPiece.dataset.color === selectedPiece.dataset.color) {
                return;
            } else {
                if (targetPiece.innerText === pieces['k'] || targetPiece.innerText === pieces['K']) {
                    alert(`Game over! ${turn} wins!`);
                    createBoard();
                    return;
                }
                square.removeChild(targetPiece);
            }
        }
        square.appendChild(selectedPiece);
        selectedPiece.style.backgroundColor = '';
        selectedPiece.dataset.row = square.dataset.row;
        selectedPiece.dataset.col = square.dataset.col;
        selectedPiece = null;
        selectedSquare = null;
        turn = turn === 'white' ? 'black' : 'white'; // Sıra değişimi
    }
}

function isValidMove(fromSquare, toSquare) {
    const fromRow = parseInt(fromSquare.dataset.row);
    const fromCol = parseInt(fromSquare.dataset.col);
    const toRow = parseInt(toSquare.dataset.row);
    const toCol = parseInt(toSquare.dataset.col);
    const piece = fromSquare.firstChild.innerText;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (piece) {
        case '♟': // Siyah Piyon
            if (fromCol === toCol && toRow - fromRow === 1 && !toSquare.firstChild) {
                return true;
            }
            if (fromCol === toCol && fromRow === 1 && toRow - fromRow === 2 && !toSquare.firstChild) {
                return true;
            }
            if (rowDiff === 1 && colDiff === 1 && toSquare.firstChild && toSquare.firstChild.dataset.color === 'white') {
                return true;
            }
            break;
        case '♙': // Beyaz Piyon
            if (fromCol === toCol && fromRow - toRow === 1 && !toSquare.firstChild) {
                return true;
            }
            if (fromCol === toCol && fromRow === 6 && fromRow - toRow === 2 && !toSquare.firstChild) {
                return true;
            }
            if (rowDiff === 1 && colDiff === 1 && toSquare.firstChild && toSquare.firstChild.dataset.color === 'black') {
                return true;
            }
            break;
        case '♜': // Kale
        case '♖':
            if ((fromRow === toRow || fromCol === toCol) && isPathClear(fromSquare, toSquare)) {
                return true;
            }
            break;
        case '♞': // At
        case '♘':
            if (rowDiff * colDiff === 2) {
                return true;
            }
            break;
        case '♝': // Fil
        case '♗':
            if (rowDiff === colDiff && isPathClear(fromSquare, toSquare)) {
                return true;
            }
            break;
        case '♛': // Vezir
        case '♕':
            if ((fromRow === toRow || fromCol === toCol || rowDiff === colDiff) && isPathClear(fromSquare, toSquare)) {
                return true;
            }
            break;
        case '♚': // Siyah Şah
        case '♔': // Beyaz Şah
            if (rowDiff <= 1 && colDiff <= 1) {
                return true;
            }
            break;
    }

    return false;
}

function isPathClear(fromSquare, toSquare) {
    const fromRow = parseInt(fromSquare.dataset.row);
    const fromCol = parseInt(fromSquare.dataset.col);
    const toRow = parseInt(toSquare.dataset.row);
    const toCol = parseInt(toSquare.dataset.col);

    const rowDirection = Math.sign(toRow - fromRow);
    const colDirection = Math.sign(toCol - fromCol);

    let currentRow = fromRow + rowDirection;
    let currentCol = fromCol + colDirection;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`).firstChild) {
            return false;
        }
        currentRow += rowDirection;
        currentCol += colDirection;
    }

    return true;
}

createBoard();
