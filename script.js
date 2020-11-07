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

    const playerOne = player("TempName", "X", 1)
    const playerTwo = player("TempName", "O", 2)
    let round = 1;

    const main = document.querySelector('.grid');
    main.innerHTML = gameBoard.renderBoard()

    const checkForWin = (val) => {
        // Solution using the Magic Square for 3x3 table
        const magicSquare = [8, 1, 6, 3, 5, 7, 4, 9, 2];
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


    // Arrow functionnel nem működik a this -> mire szól a this? miért?
    // removeEventListener és akkor nem kell nézni, hogy van-e már a cellában valami
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

    document.querySelectorAll('.cell').forEach(select => select.addEventListener('click', turn))



    return { playerOne, playerTwo }
})()

