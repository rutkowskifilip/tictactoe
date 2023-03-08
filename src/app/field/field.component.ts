import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
})
export class FieldComponent implements OnInit {
  constructor() {}
  @Output() output = new EventEmitter<number>();
  @Input()
  value!: number;
  @Input() user!: string;
  text = '';
  bgc = 'white';
  click() {
    if (this.value === 0) {
      this.output.emit(this.user === 'X' ? 1 : 2);
    }
  }

  ngOnInit(): void {
    if (this.value === 0) {
      this.text = '';
    } else if (this.value === 1 || this.value === 3) {
      this.text = 'X';
    } else {
      this.text = 'O';
    }
    if (this.value > 2) {
      this.bgc = 'grey';
    }
  }
}
