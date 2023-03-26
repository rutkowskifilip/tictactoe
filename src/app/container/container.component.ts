import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
})
export class ContainerComponent {
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

  reset(): void {
    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
    }
  }

  getAvailableMoves(): Field[] {
    const moves: Field[] = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.board[i][j] === 0) {
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
  checkMoveScore(move: Field): number {
    let finalScore = 0;
    let countP = 0;
    let countC = 0;
    let startI = move.x > 4 ? move.x - 4 : 0;
    let startJ = move.y > 4 ? move.y - 4 : 0;
    let endI = move.x < 5 ? move.x + 4 : 9;
    let endJ = move.y < 5 ? move.y + 4 : 9;
    //  wiersze
    for (let i = startJ; i <= endJ; i++) {
      if (this.board[move.x][i] === 1) {
        countP++;
        finalScore = countP > finalScore ? countP : finalScore;
        countC = 0;
      } else if (this.board[move.x][i] === 2) {
        countC++;
        finalScore = countC > finalScore ? countC : finalScore;
        countP = 0;
      } else {
        countC = 0;
        countP = 0;
      }

      if (countP === 4 || countC === 4) {
        return 4;
      }
    }

    //  kolumny

    for (let i = startI; i <= endI; i++) {
      if (this.board[i][move.y] === 1) {
        countP++;
        finalScore = countP > finalScore ? countP : finalScore;
        countC = 0;
      } else if (this.board[i][move.y] === 2) {
        countC++;

        finalScore = countC > finalScore ? countC : finalScore;
        countP = 0;
      } else {
        countC = 0;
        countP = 0;
      }

      if (countP === 4 || countC === 4) {
        return 4;
      }
    }
    let playerStrength = 0;
    let opponentStrength = 0;
    const maxIndex = 4;
    const directions: [number, number][] = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (let i = 0; i < directions.length; i++) {
      let playerCount = 0;
      let opponentCount = 0;
      const direction = directions[i];

      for (let j = 1; j <= maxIndex; j++) {
        const newRow = move.x + j * direction[0];
        const newCol = move.y + j * direction[1];

        if (
          newRow < 0 ||
          newRow >= this.board.length ||
          newCol < 0 ||
          newCol >= this.board[0].length
        ) {
          break; // przekroczenie zakresu planszy, koniec szukania
        }

        const cell = this.board[newRow][newCol];

        if (cell === 1) {
          playerCount++;

          // zwiększanie siły pola gracza tylko wtedy, gdy nie została przekroczona maksymalna odległość 5 pól
          if (playerCount <= maxIndex) {
            playerStrength += playerCount;
          }
        } else if (cell === 2) {
          opponentCount++;

          // zwiększanie siły pola przeciwnika tylko wtedy, gdy nie została przekroczona maksymalna odległość 5 pól
          if (opponentCount <= maxIndex) {
            opponentStrength += opponentCount;
          }
        } else {
          break; // jeśli pole jest puste, przerywamy szukanie w tym kierunku
        }
      }
    }

    const strength =
      playerStrength > opponentStrength ? playerStrength : opponentStrength;

    finalScore = strength > finalScore ? strength : finalScore;
    if (move.y === 4 && move.x === 5) {
    }

    return finalScore;
  }
  evaluateMove(player: number): Field {
    let bestMove: Field = { x: 0, y: 0 };
    let bestScore = 0;
    const moves = this.getAvailableMoves();
    console.log('moves', moves);

    moves.forEach((e) => {
      const score = this.checkMoveScore(e);
      if (score > bestScore) {
        bestScore = score;
        bestMove = e;
      }
    });
    console.log('==================');
    return bestMove;
  }

  makeMove(player: number): void {
    // console.log(player);

    const move = this.evaluateMove(player);
    console.log(move);

    // console.log(move);

    this.board[move.x][move.y] = player;
    setTimeout(() => {
      const moves = this.getAvailableMoves();
      if (moves.length === 0) {
        alert(this.xScore > this.oScore ? 'Winner: X' : 'Winner: O');
      }
    }, 500);
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

interface Field {
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
