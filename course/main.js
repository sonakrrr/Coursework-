const game = document.getElementById("game");
const res = document.getElementById("res");
const resetBtn = document.getElementById("reset");
const you = "X",
    ai = "O";

class Game {
    constructor(boardSize = 3) {
        this.boardSize = boardSize;
        this.step = Math.floor(Math.random() * 2);
        this.stepCount = 0;

        resetBtn.addEventListener("click", () => {
            this.resetGame();
        });

        this.cellArray = [];
        this.resetGame();
    }

    get lim() {
        return this.boardSize * this.boardSize;
    }

    createCellArray() {
        for (let i = 0; i < this.lim; i++) {
            const cell = document.createElement("div");
            cell.setAttribute("data-id", i);
            cell.addEventListener("click", this.yourSteps());
            game.appendChild(cell);
            this.cellArray.push(cell);
        }
    }

    resetGame() {
        this.board = [...Array(this.lim).keys()];
        res.innerHTML = "";
        game.innerHTML = "";
        this.stepCount = 0;
        this.cellArray = [];
        this.createCellArray();
    }

    yourSteps() {
        return (e) => {
            this.stepCount += 1;
            const id = e.target.getAttribute("data-id");
            this.board[+id] = you;
            this.cellArray[+id].innerHTML = `<span>${you}</span>`;
            if (this.stepCount >= this.lim) {
                this.showRes("YOU HAVE A TIE");
                return;
            }
            if (this.checkWinner(this.board, you)) {
                this.showRes("GOOD JOB, YOU WON");
                return;
            }
            this.aiSteps();
        };
    }

    aiSteps() {
        this.stepCount += 1;
        const bestStep = this.minimax(this.board, ai);
        this.board[bestStep.idx] = ai;
        this.cellArray[bestStep.idx].innerHTML = `<span>${ai}</span>`;
        if (this.stepCount >= this.lim) {
            this.showRes("YOU HAVE A TIE");
            return;
        }
        if (this.checkWinner(this.board, ai)) {
            this.showRes("YOU ARE A FAILURE");
            return;
        }
    }

    checkWinner(board, player) {
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

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (
                board[a] === player &&
                board[b] === player &&
                board[c] === player
            ) {
                return true;
            }
        }

        return false;
    }

    minimax(board, player) {
        const emptyCells = this.findEmptyCells(board);
        if (this.checkWinner(board, you)) {
            return { score: -1 };
        } else if (this.checkWinner(board, ai)) {
            return { score: 1 };
        } else if (emptyCells.length === 0) {
            return { score: 0 };
        }

        const steps = [];

        for (let i = 0; i < emptyCells.length; i++) {
            const move = { idx: emptyCells[i] };
            board[emptyCells[i]] = player;
            if (player === you) {
                move.score = this.minimax(board, ai).score;
            } else if (player === ai) {
                move.score = this.minimax(board, you).score;
            }
            board[emptyCells[i]] = move.idx;
            steps.push(move);
        }

        let bestStep = null;

        if (player === ai) {
            let bestScore = -Infinity;
            for (let i = 0; i < steps.length; i++) {
                if (steps[i].score > bestScore) {
                    bestScore = steps[i].score;
                    bestStep = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < steps.length; i++) {
                if (steps[i].score < bestScore) {
                    bestScore = steps[i].score;
                    bestStep = i;
                }
            }
        }

        return steps[bestStep];
    }

    findEmptyCells(board) {
        return board.filter((cell) => cell !== you && cell !== ai);
    }

    showRes(message) {
        res.innerHTML = `<h3>${message}</h3>`;
    }

}

new Game();