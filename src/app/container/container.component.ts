import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
})
export class ContainerComponent {
  // humanPlayer: number = ;
  // computerPlayer: number;
  // constructor(humanPlayer: number, computerPlayer: number) {
  //   this.humanPlayer = humanPlayer;
  //   this.computerPlayer = computerPlayer;
  //   this.reset();
  // }
  @Output() output = new EventEmitter<number[]>();
  player: string = '';
  x: boolean = true;
  toColor: number[][] = new Array();
  board: number[][] = new Array();
  xScore = 0;
  oScore = 0;
  clicked(n: number, i: number, j: number) {
    this.board[i][j] = n;

    this.makeMove(2);

    // if (this.x) {
    //   this.player = 'O';
    //   this.x = false;
    // } else {
    //   this.player = 'X';
    //   this.x = true;
    // }

    if (this.checkWinner(this.board, 1)) {
      this.xScore++;
    }
    if (this.checkWinner(this.board, 2)) {
      this.oScore++;
    }

    // console.log(this.xScore, this.oScore);
    this.output.emit([this.xScore, this.oScore]);
  }
  checkWinner(board: number[][], n: number): boolean {
    // Sprawdź wiersze

    for (let i = 0; i < board.length; i++) {
      let count = 0;
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] === n) {
          this.toColor.push([i, j]);
          count++;
          if (count === 5) {
            this.toColor.forEach((e) => {
              board[e[0]][e[1]] = n + 2;
            });
            return true;
          }
        } else {
          this.toColor.splice(0, this.toColor.length);
          count = 0;
        }
      }
    }

    // Sprawdź kolumny
    for (let j = 0; j < board.length; j++) {
      let count = 0;
      for (let i = 0; i < board.length; i++) {
        if (board[i][j] === n) {
          this.toColor.push([i, j]);
          count++;
          if (count === 5) {
            this.toColor.forEach((e) => {
              board[e[0]][e[1]] = n + 2;
            });
            return true;
          }
        } else {
          this.toColor.splice(0, this.toColor.length);
          count = 0;
        }
      }
    }

    // Sprawdź przekątne
    for (let i = 0; i < board.length - 4; i++) {
      for (let j = 0; j < board.length - 4; j++) {
        if (
          board[i][j] === n &&
          board[i + 1][j + 1] === n &&
          board[i + 2][j + 2] === n &&
          board[i + 3][j + 3] === n &&
          board[i + 4][j + 4] === n
        ) {
          board[i][j] = n + 2;
          board[i + 1][j + 1] = n + 2;
          board[i + 2][j + 2] = n + 2;
          board[i + 3][j + 3] = n + 2;
          board[i + 4][j + 4] = n + 2;
          return true;
        }
        if (
          board[i][j + 4] === n &&
          board[i + 1][j + 3] === n &&
          board[i + 2][j + 2] === n &&
          board[i + 3][j + 1] === n &&
          board[i + 4][j] === n
        ) {
          board[i][j + 4] = n + 2;
          board[i + 1][j + 3] = n + 2;
          board[i + 2][j + 2] = n + 2;
          board[i + 3][j + 1] = n + 2;
          board[i + 4][j] = n + 2;
          return true;
        }
      }
    }

    // Nie znaleziono zwycięzcy
    return false;
  }

  // ================================================================================

  winningCombinations: number[][] = [
    [0, 1, 2, 3, 4],
    [10, 11, 12, 13, 14],
    [20, 21, 22, 23, 24],
    [30, 31, 32, 33, 34],
    [40, 41, 42, 43, 44],
    [0, 10, 20, 30, 40],
    [1, 11, 21, 31, 41],
    [2, 12, 22, 32, 42],
    [3, 13, 23, 33, 43],
    [4, 14, 24, 34, 44],
    [0, 11, 22, 33, 44],
    [4, 13, 22, 31, 40],
  ];

  reset(): void {
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
    }
  }

  getAvailableMoves(): number[][] {
    console.log('here');

    const moves: number[][] = [];
    for (let i = 0; i < 10; i++) {
      // console.log(i);

      for (let j = 0; j < 10; j++) {
        if (this.board[i][j] === 0) {
          moves.push([i, j]);
        }
      }
    }
    // console.log('moves ' + moves);

    return moves;
  }

  isGameOver(): boolean {
    const availableMoves = this.getAvailableMoves();
    return availableMoves.length === 0;
  }
  getWinningPlayer(): number {
    return this.checkWinner(this.board, 2) ? 2 : 0;
  }

  evaluateMove(player: number): Move {
    if (this.isGameOver()) {
      if (this.getWinningPlayer() === 2) {
        return { index: [0], score: 10 };
      } else if (this.getWinningPlayer() === 1) {
        return { index: [0], score: -10 };
      } else {
        return { index: [0], score: 0 };
      }
    }

    const moves: Move[] = [];

    for (const move of this.getAvailableMoves()) {
      this.board[move[0]][move[1]] = 2;
      const score = this.evaluateMove(1).score;
      moves.push({ index: move, score: score });
      this.board[move[0]][move[1]] = 0;
    }

    let bestMove: Move = { index: [0], score: 0 };
    let bestScore = -Infinity;

    for (const move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  makeMove(player: number): void {
    // console.log(player);

    const move = this.evaluateMove(player);
    // console.log(move);

    // this.board[move.index[0]][move.index[1]] = player;
  }

  ngOnInit(): void {
    this.player = 'X';
    for (let i = 0; i < 10; i++) {
      this.board.push([]);
      for (let j = 0; j < 10; j++) {
        this.board[i].push(0);
      }
    }
  }
}
// interface Board {
//   [key: string]: string;
// }
interface Move {
  index: number[];
  score: number;
}

// Example usage

// Computer makes move
// Human makes move
// ...continue the game
