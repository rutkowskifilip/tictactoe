import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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

    if (this.x) {
      this.player = 'O';
      this.x = false;
    } else {
      this.player = 'X';
      this.x = true;
    }

    if (this.checkWinner(this.board, n)) {
      n === 1 ? this.xScore++ : this.oScore++;
    }
    console.log(this.xScore, this.oScore);
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
