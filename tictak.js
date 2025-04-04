var board;
var playerO = "O";
var playerX = "X";
var currPlayer = playerO;
var gameOver = false;
var moves = { "O": [], "X": [] }; // Track last 3 moves for each player

window.onload = function() {
    setGame();
    updateTurnIndicator();
};

function setGame() {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];

    document.getElementById("board").innerHTML = ""; // Clear previous board (if any)

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            if (r == 0 || r == 1) {
                tile.classList.add("horizontal-line");
            }
            if (c == 0 || c == 1) {
                tile.classList.add("vertical-line");
            }
            tile.innerText = "";
            tile.addEventListener("click", setTile);
            document.getElementById("board").appendChild(tile);
        }
    }
}

function setTile() {
    if (gameOver) return; // Stop if game is over

    let [r, c] = this.id.split("-").map(Number);
    if (board[r][c] !== ' ') return; // Prevent overwriting a tile

    // Remove the oldest move if already 3 moves are made
    if (moves[currPlayer].length === 3) {
        let [oldR, oldC] = moves[currPlayer].shift(); 
        board[oldR][oldC] = ' ';
        let oldTile = document.getElementById(`${oldR}-${oldC}`);
        oldTile.innerText = "";
        oldTile.classList.remove("fading");
    }

    // Register new move
    board[r][c] = currPlayer;
    this.innerText = currPlayer;
    moves[currPlayer].push([r, c]);

    // Highlight the oldest move before removal
    if (moves[currPlayer].length === 3) {
        let [oldR, oldC] = moves[currPlayer][0];
        let oldTile = document.getElementById(`${oldR}-${oldC}`);
        oldTile.classList.add("fading");
    }

    checkWinner(); // Check if someone won

    currPlayer = (currPlayer === playerO) ? playerX : playerO;
    updateTurnIndicator(); // Update player turn UI
}

function checkWinner() {
    for (let r = 0; r < 3; r++) {
        if (board[r][0] === board[r][1] && board[r][1] === board[r][2] && board[r][0] !== ' ') {
            highlightWinningTiles([[r, 0], [r, 1], [r, 2]]);
            return;
        }
    }

    for (let c = 0; c < 3; c++) {
        if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[0][c] !== ' ') {
            highlightWinningTiles([[0, c], [1, c], [2, c]]);
            return;
        }
    }

    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ' ') {
        highlightWinningTiles([[0, 0], [1, 1], [2, 2]]);
        return;
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== ' ') {
        highlightWinningTiles([[0, 2], [1, 1], [2, 0]]);
        return;
    }
}

function highlightWinningTiles(tiles) {
    tiles.forEach(([r, c]) => {
        document.getElementById(`${r}-${c}`).classList.add("winner");
    });
    gameOver = true;
    setTimeout(() => location.reload(), 3000);
}

// Player Turn Indicator Update
function updateTurnIndicator() {
    let xIndicator = document.querySelector(".player_x");
    let oIndicator = document.querySelector(".player_o");

    if (currPlayer === playerO) {
        oIndicator.classList.add("active");
        xIndicator.classList.remove("active");
    } else {
        xIndicator.classList.add("active");
        oIndicator.classList.remove("active");
    }
}
