
// =====================================
// 1. GAMEBOARD
// =====================================

const Gameboard = (() => {

    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const placeMarker = (index, marker) => {
        if (index < 0 || index > 8 || board[index] !== "") {
            return false;
        }

        board[index] = marker;
        return true;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return {
        getBoard,
        placeMarker,
        resetBoard
    };

})();


// =====================================
// 2. PLAYER FACTORY
// =====================================

const Player = (name, marker) => {

    const getName = () => name;
    const getMarker = () => marker;

    return {
        getName,
        getMarker
    };

};


// =====================================
// 3. GAME CONTROLLER
// =====================================

const GameController = (() => {

    let player1;
    let player2;
    let activePlayer;
    let gameOver = false;
    let gameStarted = false;
    let message = "Enter player names and start the game!";

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Start a new game
    const startGame = (name1, name2) => {

        player1 = Player(name1, "X");
        player2 = Player(name2, "O");

        activePlayer = player1;

        Gameboard.resetBoard();

        gameOver = false;
        gameStarted = true;

        message = `${player1.getName()}'s turn (X)`;

    };

    // Check for a winner
    const checkWinner = () => {

        const board = Gameboard.getBoard();

        return winningCombinations.some(combination => {

            const [a, b, c] = combination;

            return (
                board[a] !== "" &&
                board[a] === board[b] &&
                board[b] === board[c]
            );

        });

    };

    // Play a round
    const playRound = (index) => {

        if (!gameStarted || gameOver) return;

        const marker = activePlayer.getMarker();

        const successfulMove = Gameboard.placeMarker(index, marker);

        if (!successfulMove) return;

        if (checkWinner()) {

            message = `${activePlayer.getName()} wins!`;
            gameOver = true;

        } else if (!Gameboard.getBoard().includes("")) {

            message = "It's a tie!";
            gameOver = true;

        } else {

            activePlayer = activePlayer === player1 ? player2 : player1;

            message = `${activePlayer.getName()}'s turn (${activePlayer.getMarker()})`;

        }

    };

    // Restart the game
    const restartGame = () => {

        if (!gameStarted) return;

        Gameboard.resetBoard();

        activePlayer = player1;

        gameOver = false;

        message = `${player1.getName()}'s turn (X)`;

    };

    // Get current game information
    const getGameStatus = () => ({

        board: Gameboard.getBoard(),
        message,
        gameOver,
        gameStarted

    });

    return {
        startGame,
        playRound,
        restartGame,
        getGameStatus
    };

})();


// =====================================
// 4. DISPLAY CONTROLLER
// =====================================

const DisplayController = (() => {

    const cells = document.querySelectorAll(".cell");

    const status = document.querySelector("#status");

    const player1Input = document.querySelector("#player1");

    const player2Input = document.querySelector("#player2");

    const startButton = document.querySelector("#start-game");

    const restartButton = document.querySelector("#restart");


    // Display the gameboard
    const render = () => {

        const game = GameController.getGameStatus();

        cells.forEach((cell, index) => {

            cell.textContent = game.board[index];

            cell.disabled =
                !game.gameStarted ||
                game.gameOver ||
                game.board[index] !== "";

        });

        status.textContent = game.message;

    };


    // Start button
    const startGame = () => {

        const name1 = player1Input.value.trim() || "Player 1";

        const name2 = player2Input.value.trim() || "Player 2";

        GameController.startGame(name1, name2);

        render();

    };


    // Handle square clicks
    const handleClick = (event) => {

        const index = Number(event.target.dataset.index);

        GameController.playRound(index);

        render();

    };


    // Restart button
    const restartGame = () => {

        GameController.restartGame();

        render();

    };


    // Add event listeners
    startButton.addEventListener("click", startGame);

    restartButton.addEventListener("click", restartGame);

    cells.forEach(cell => {

        cell.addEventListener("click", handleClick);

    });


    // Initial display
    render();

    return {
        render
    };

})();
