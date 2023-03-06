import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css'],
})
export class FieldComponent implements OnInit {
  constructor() {}
  clicked = '';
  @Input() user: string;
  click() {
    this.clicked = this.user;
  }

  ngOnInit(): void {}
}
