// Gameboard object
const gameBoard = (() => {
    let board = ['','','','','','','','',''];

    let renderBoard = () => {
        return board.map((val, index) => {
            return `
            <div class="cell" id="cell-${index}" data-label="${index}">${val}</div>
            `
        }).join('');
    };

    let clearBoard = () => {
        for (let i = 0; i < 9; i++) {
            board[i] = '';
        };
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

        if (game.checkForWin(newBoard, humanPlayer)) {
            return {score:-10};
        } else if (game.checkForWin(newBoard, game.playerAi)) {
            return {score:10};
        } else if (game.checkForTie(newBoard)) {
            return {score:0};
        }
        
        const moves = [];

        for (let i = 0; i < availableSlots.length; i++) {
            let move = {};

            move.index = availableSlots[i];
            newBoard[availableSlots[i]] = player.playerSign;


            if (player === game.playerAi) {
                let result = minimax(newBoard, humanPlayer);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, game.playerAi);
                move.score = result.score;
            }

            newBoard[availableSlots[i]] = "";
            

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
        return moves[bestMove]
    }

    return {minimax}
})()


// Game logic and control
const game = (() => {
    let playAgainstComputer;
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
        playAgainstComputer = document.querySelector('#computer').checked;
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
    }

    const gameWon = (winner) => {
        
        document.querySelector('.players').innerHTML = `
            <div class="input-container">
                <div>
                    <h1>${winner} has won the game!</h1>
                </div>
                <div>
                    <button id="new-game">Play Again</button>
                </div>
            </div>
        `
        document.querySelector('#new-game').addEventListener('click', startGame)
        document.querySelectorAll('.cell').forEach(select => select.removeEventListener('click', turn))
    }

    const tie = () => {
        document.querySelector('.players').innerHTML = `
        <div class="input-container">
            <div>
                <h1>It's a tie! Play again?</h1>
            </div>
            <div>
                <button id="new-game">Play Again</button>
            </div>
        </div>
    `
    document.querySelector('#new-game').addEventListener('click', startGame)
    document.querySelectorAll('.cell').forEach(select => select.removeEventListener('click', turn))
    }


    function turn() {
        const that = this;
        
        function step(player) {
            that.innerText = player.playerSign;
            if (player === playerAi) {
                let best = computerAi.minimax(gameBoard.board, playerAi).index;
                gameBoard.board[best] = playerAi.playerSign;
                const cell = document.querySelector(`#cell-${best}`)
                cell.innerText = playerAi.playerSign;
                cell.removeEventListener('click', turn);
            } else {
                gameBoard.board[that.dataset.label] = player.playerSign;
                that.removeEventListener('click', turn);
            }
            if (checkForWin(gameBoard.board, player)) {
                gameWon(player.playerName)
            } else if (checkForTie(gameBoard.board)) {
                tie()
            }
            round++
        }

        if (!playAgainstComputer) {
            if (round % 2 !== 0) {
                step(playerOne);
            } else {
                step(playerTwo);
            }
        } else {
            if (round % 2 !== 0) {
                step(playerOne);
                if (!checkForTie(gameBoard.board)) {
                    turn()
                }
            } else {
                setTimeout(()=>{step(playerAi)}, 800)
            }
        }

    }



    const newGame = () => {
        playerOne = null;
        playerTwo = null;
        round = 1;
        gameBoard.clearBoard()

        const main = document.querySelector('.grid');
        main.innerHTML = gameBoard.renderBoard()
        initializePlayers()
        document.querySelectorAll('.cell').forEach(select => select.addEventListener('click', turn))
        if (playAgainstComputer) {
            document.querySelector('.players').innerHTML = `
            <div>
                <h2>Player One (${playerOne.playerSign}): ${playerOne.playerName}</h2>
                <h2>Player Two (${playerAi.playerSign}): ${playerAi.playerName}</h2>
            </div>
        `
        } else {
            document.querySelector('.players').innerHTML = `
                <div>
                    <h2>Player One (${playerOne.playerSign}): ${playerOne.playerName}</h2>
                    <h2>Player Two (${playerTwo.playerSign}): ${playerTwo.playerName}</h2>
                </div>
            `
        }
    }

    const startGame = () => {
        const playerForm = 
        `
        <div class="input-container">
        <div class="player-inputs">
            <input type="text" id="player-one" placeholder="Insert Player One Name">
        </div>
        <div class="player-inputs">   
            <input type="text" id="player-two" placeholder="Insert Player Two Name"> 
        </div>
        <div class="against-computer">
            <input type="checkbox" id="computer" name="computer">Play against computer?</input>
        </div>
        <div class="start-button">
            <button id="start-game">Insert Coin</button>
        </div>
        </div>
        `;
        let header = document.querySelector('.players');
        header.innerHTML = playerForm;
        let skynet = document.querySelector('#computer');
        skynet.addEventListener('change', function() {
            if (this.checked) {
                console.log('Works')
                document.querySelector('#player-two').hidden = true;
            } else {
                document.querySelector('#player-two').hidden = false;
            };
        })
        document.querySelector('#start-game').addEventListener('click', newGame);
        document.querySelector('.play-area').innerHTML = `<div class="grid"></div>`;
    }
    startGame()

    

    return { getPlayer, checkForWin, playerAi, playerTwo, checkForTie }

})()

