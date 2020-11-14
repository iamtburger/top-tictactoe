// Gameboard object
const gameBoard = (() => {
    // let board = ['','','','','','','','',''];
    let board = ['X','','O','O','','O','X','',''];

    let renderBoard = () => {
        return board.map((val, index) => {
            return `
            <div class="cell" id="cell-${index}" data-label="${index}">${val}</div>
            `
        }).join('');
    };

    let clearBoard = () => {
        // for (let i = 0; i < 9; i++) {
        //     board[i] = '';
        // };
        document.querySelector('.grid').innerHTML = renderBoard()

    }

    return {board, renderBoard, clearBoard}

})();

// Player object
function player(name, sign, num) {
    const playerNum = num;
    const playerName = name;
    const playerSign = sign;

    return { playerName, playerSign, playerNum }
}

const computerAi = (() => {
    let depth = 0;

    const remainingSteps = function(board) {
        let emptyCells = []
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                emptyCells.push(i);
            }
        }
        return emptyCells;
    };


    function minimax (newBoard, player) {
        depth++;

        const humanPlayer = game.getPlayer()
        let availableSlots = remainingSteps(newBoard);

        // console.log('depth: '+depth)
        // console.log('board: '+newBoard)
        // console.log('available slots: '+availableSlots)

        if (game.checkForWin(newBoard, humanPlayer)) {
            // console.log(-10)
            return -10;
        } else if (game.checkForWin(newBoard, game.playerAi)) {
            // console.log(10)
            return 10;
        } else if (game.checkForTie(newBoard)) {
            // console.log(0)
            return 0;
        }
        
        const moves = [];

        for (let i = 0; i < availableSlots.length; i++) {
            let move = {};
            // console.log('current slot: '+availableSlots[i])
            // console.log('current player: '+player.playerSign)
            move.index = availableSlots[i];
            newBoard[availableSlots[i]] = player.playerSign;
            // console.log('before:'+newBoard)
            // console.log('selected: '+newBoard[availableSlots[i]])

            if (player === game.playerAi) {
                let result = minimax(newBoard, humanPlayer);
                move.score = result;
            } else {
                let result = minimax(newBoard, game.playerAi);
                move.score = result;
            }

            newBoard[availableSlots[i]] = "";
            // console.log('after:'+newBoard)

            // console.log(move)
            moves.push(move);
        };

        let bestMove;
        if (player === game.playerAi) {
            let bestScore = -100;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 100;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        // console.log(moves)
        console.log(moves[bestMove])
        return moves[bestMove]
    }
    // checking if it works till this step
    // minimax(gameBoard.board, game.playerAi)

    return {minimax}
})()


// Game logic and control
const game = (() => {
    let round = 1;
    let playerOne;
    let playerTwo;
    let playerAi = player('Skynet', 'O', 2)

    let getPlayer = () => {
        return playerOne;
    }
    

    function initializePlayers() {
        const playerOneName = document.querySelector('#player-one').value;
        const playerTwoName = document.querySelector('#player-two').value;
        playerOne = player(playerOneName, "X", 1)
        playerTwo = player(playerTwoName, "O", 2);
    }



    const checkForTie = (board) => {
            let emptyCells = []
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    emptyCells.push(i);
                }
            }
            emptyCells;
        ;
        if (emptyCells.length === 0) {
            return true
        }
    }

    
    const checkForWin = (board, player) => {
        // Solution using the Magic Square for 3x3 table
        const magicSquare = [8, 1, 6, 3, 5, 7, 4, 9, 2];
        const c = player.playerSign
        // Stores the possible winning combinations
        const winningStates = [
            [c,c,c,'','','','','',''],
            ['','','',c,c,c,'','',''],
            ['','','','','','',c,c,c],
            [c,'','','',c,'','','',c],
            ['','',c,'',c,'',c,'',''],
            [c,'','',c,'','',c,'',''],
            ['',c,'','',c,'','',c,''],
            ['','',c,'','',c,'','',c],
        ];

        for (i = 0; i < winningStates.length; i++) {
            let winNum = 0;
            for (j = 0; j < winningStates[i].length; j++) {
                if (board[j] === c && winningStates[i][j] === c) {
                    winNum = winNum + magicSquare[j]
                }
            }
            if (winNum === 15) {
                return true
            }

        }
        return false
        // if (round === 9) {
        //     tie()
        // }

        // Solution using if else statements
        // if (gameBoard.board[0] === val && gameBoard.board[1] === val && gameBoard.board[2] === val) {
        //     console.log(`${val} WON THE GAME`)
        // } else if (gameBoard.board[3] === val && gameBoard.board[4] === val && gameBoard.board[5] === val) {
        //     console.log(`${val} WON THE GAME`)
        // } else if (gameBoard.board[6] === val && gameBoard.board[7] === val && gameBoard.board[8] === val) {
        //     console.log(`${val} WON THE GAME`)
        // } else if (gameBoard.board[0] === val && gameBoard.board[3] === val && gameBoard.board[6] === val) {
        //     console.log(`${val} WON THE GAME`)
        // } else if (gameBoard.board[1] === val && gameBoard.board[4] === val && gameBoard.board[7] === val) {
        //     console.log(`${val} WON THE GAME`)
        // } else if (gameBoard.board[2] === val && gameBoard.board[5] === val && gameBoard.board[8] === val) {
        //     console.log(`${val} WON THE GAME`)
        // } else if (gameBoard.board[0] === val && gameBoard.board[4] === val && gameBoard.board[8] === val) {
        //     console.log(`${val} WON THE GAME`)
        // } else if (gameBoard.board[2] === val && gameBoard.board[4] === val && gameBoard.board[6] === val) {
        //     console.log(`${val} WON THE GAME`)
        // }
    }

    const gameWon = (winner) => {
        document.querySelector('.play-area').innerHTML = `
            <div>
                <h1>${winner} has won the game!</h1>
            </div>
            <div>
                <button id="new-game">Play Again</button>
            </div>
        `
        document.querySelector('#new-game').addEventListener('click', startGame)
    }

    const tie = () => {
        document.querySelector('.play-area').innerHTML = `
        <div>
            <h1>It's a tie! Play again?</h1>
        </div>
        <div>
            <button id="new-game">Play Again</button>
        </div>
    `
    document.querySelector('#new-game').addEventListener('click', startGame)
    }


    function turn() {
        if (round % 2 !== 0) {
            this.innerText = playerOne.playerSign;
            gameBoard.board[this.dataset.label] = playerOne.playerSign;
            this.removeEventListener('click', turn);
            let best = computerAi.minimax(gameBoard.board, playerAi);
            if (checkForWin(gameBoard.board, playerOne)) {
                gameWon(playerOne.playerName)
            } else if (checkForTie(gameBoard.board)) {
                tie()
            }
            round++
            
        } else {
            this.innerText = playerTwo.playerSign;
            gameBoard.board[this.dataset.label] = playerTwo.playerSign;
            this.removeEventListener('click', turn);
            if (checkForWin(gameBoard.board, playerTwo)) {
                gameWon(playerTwo.playerName)
            } else if (checkForTie(gameBoard.board)) {
                tie()
            }
            round++
        }
    }



    const newGame = () => {
        playerOne = null;
        playerTwo = null;
        round = 1;
        console.log('NEW GAME STARTED')
        gameBoard.clearBoard()

        const main = document.querySelector('.grid');
        main.innerHTML = gameBoard.renderBoard()
        initializePlayers()
        document.querySelectorAll('.cell').forEach(select => select.addEventListener('click', turn))
        document.querySelector('.players').innerHTML = `
            <div>
                <h2>Player One (${playerOne.playerSign}): ${playerOne.playerName}</h2>
                <h2>Player Two (${playerTwo.playerSign}): ${playerTwo.playerName}</h2>
            </div>
        `
    }

    const startGame = () => {
        const playerForm = 
        `
        <div>
            <input type="text" id="player-one" placeholder="Insert Player One Name">
            <input type="text" id="player-two" placeholder="Insert Player Two Name">
        </div>
        <div>
            <button id="start-game">Insert Coin</button>
        </div>
        `;
        let header = document.querySelector('.players');
        header.innerHTML = playerForm;
        document.querySelector('#start-game').addEventListener('click', newGame)
        document.querySelector('.play-area').innerHTML = `<div class="grid"></div>`
    }
    startGame()

    

    return { getPlayer, checkForWin, playerAi, playerTwo, checkForTie }

})()

