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

// Game logic and control
const game = (() => {
    let round = 1;

    let initializePlayers = (res, rej) => {
        const playerOneName = document.querySelector('#player-one').value;
        const playerTwoName = document.querySelector('#player-two').value;

        console.log(playerOneName, playerTwoName)
        
        return {playerOneName}
    }


    const playerForm = 
    `
    <div>
        <input type="text" id="player-one" placeholder="Insert Player One Name">
        <input type="text" id="player-two" placeholder="Insert Player Two Name">
    </div>
    <div>
        <button id="start-game">Start Game</button>
    </div>
    `;
    



    
    const checkForWin = (val) => {
        // Solution using the Magic Square for 3x3 table
        const magicSquare = [8, 1, 6, 3, 5, 7, 4, 9, 2];
        // Stores the possible winning combinations
        const winningStates = [
            [val,val,val,'','','','','',''],
            ['','','',val,val,val,'','',''],
            ['','','','','','',val,val,val],
            [val,'','','',val,'','','',val],
            ['','',val,'',val,'',val,'',''],
            [val,'','',val,'','',val,'',''],
            ['',val,'','',val,'','',val,''],
            ['','',val,'','',val,'','',val],
        ];

        for (i = 0; i < winningStates.length; i++) {
            let winNum = 0;
            for (j = 0; j < winningStates[i].length; j++) {
                if (gameBoard.board[j] === val && winningStates[i][j] === val) {
                    winNum = winNum + magicSquare[j]
                }
            }
            if (winNum === 15) {
                console.log(`${val} WON THE GAME`)
            }
        }


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


    function turn() {
        if (round % 2 !== 0) {
            this.innerText = playerOne.playerSign;
            gameBoard.board[this.dataset.label] = playerOne.playerSign;
            this.removeEventListener('click', turn);
            checkForWin(playerOne.playerSign)
            round++
        } else {
            this.innerText = playerTwo.playerSign;
            gameBoard.board[this.dataset.label] = playerTwo.playerSign;
            this.removeEventListener('click', turn);
            checkForWin(playerTwo.playerSign)
            round++
        }
    }
    const playerOne = player(initializePlayers.playerOneName, "X", 1);
    const playerTwo = player('name', "O", 2);

    const newGame = () => {
        // const playerOne = null;
        // const playerTwo = null;
        round = 1;
    
        const main = document.querySelector('.grid');
        main.innerHTML = gameBoard.renderBoard()
        document.querySelector('.players').innerHTML = playerForm
        document.querySelector('#start-game').addEventListener('click', initializePlayers)
        document.querySelectorAll('.cell').forEach(select => select.addEventListener('click', turn))

    }

    newGame()

    return {playerOne, initializePlayers}
})()

