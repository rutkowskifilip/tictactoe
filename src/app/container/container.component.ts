import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TitleStrategy } from '@angular/router';

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
  checkMoveScore(move: number[]): number {
    let finalScore = 0;
    let countP = 0;
    let countC = 0;
    const startI = move[0] - 4 > 0 ? move[0] - 4 : 0;
    const startJ = move[1] - 4 > 0 ? move[1] - 4 : 0;
    const endI = move[0] + 4 < 9 ? move[0] + 4 : 9;
    const endJ = move[1] + 4 < 9 ? (move[1] = 4) : 9;
    //wiersze
    // console.log(startI, startJ, endI, endJ);
    console.log(move);

    for (let i = startI; i < endI; i++) {
      for (let j = startJ; j < endJ; j++) {
        // console.log(this.board[i][j]);

        if (this.board[i][j] === 1) {
          countP++;
          finalScore = countP;
          countC = 0;
        } else if (this.board[i][j] === 2) {
          countC++;
          finalScore = countC;
          countP = 0;
        } else {
          countC = 0;
          countP = 0;
        }
        if (countP === 4 || countC === 4) {
          return 4;
        }
      }
    }

    //kolumny
    for (let i = startI; i < endI; i++) {
      for (let j = startJ; j < endJ; j++) {
        if (this.board[j][i] === 1) {
          countP++;
          countP > finalScore ? (finalScore = countP) : '';

          countC = 0;
        } else if (this.board[j][i] === 2) {
          countC++;
          countC > finalScore ? (finalScore = countC) : '';
          countP = 0;
        } else {
          countC = 0;
          countP = 0;
        }
        if (countP === 4 || countC === 4) {
          return 4;
        }
      }
    }
    let j = move[1];
    for (let i = move[0] + 1; i < endI; i++) {
      j++;
      let countP = 0;
      let countC = 0;
      if (this.board[i][j] === 1) {
        countP++;
        countP > finalScore ? (finalScore = countP) : '';

        countC = 0;
      } else if (this.board[i][j] === 2) {
        countC++;
        countC > finalScore ? (finalScore = countC) : '';
        countP = 0;
      } else {
        countC = 0;
        countP = 0;
      }
      if (countP === 4 || countC === 4) {
        return 4;
      }
    }
    // finalScore > 0 ? console.log(finalScore, move) : '';

    return finalScore;
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

  getAvailableMoves(): Point[] {
    // console.log('here');

    const moves: Point[] = [];
    for (let i = 0; i < 10; i++) {
      // console.log(i);

      for (let j = 0; j < 10; j++) {
        console.log(i, j);

        if (this.board[i][j] === 0) {
          console.log('tttt', i, j);

          moves.push({ x: i, y: j });
        }
      }
    }

    return moves;
  }

  isGameOver(): boolean {
    const availableMoves = this.getAvailableMoves();
    return availableMoves.length === 0;
  }
  getWinningPlayer(): number {
    return this.checkWinner(this.board, 2) ? 2 : 0;
  }

  evaluateMove(player: number): number[] {
    if (this.isGameOver()) {
      this.checkWinner;
    }
    let bestMove = [0, 0];
    let bestScore = 0;
    const moves = this.getAvailableMoves();
    console.log(moves);

    moves.forEach((e) => {
      // const score = this.checkMoveScore(e);
      // if (score > bestScore) {
      //   bestScore = score;
      //   // bestMove = e;
      // }
    });
    // console.log('+==================');
    return bestMove;
  }

  makeMove(player: number): void {
    // console.log(player);

    const move = this.evaluateMove(player);
    // console.log(move);

    this.board[move[0]][move[1]] = player;
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

interface Point {
  x: number;
  y: number;
}
interface Move {
  index: number[];
  score: number;
}

// Computer makes move
// Human makes move
// ...continue the game
