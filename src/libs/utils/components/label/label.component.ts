import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'l-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  @Input()
  text: string;
  @Input()
  color = 'black';
  @Input()
  invalidColor = 'red';
  @Input()
  isValid: { valid?: boolean; prop?: string } = { valid: true };
  @Input()
  alignment = 'left';
  @Input()
  display = 'block';
  @Input()
  width: string;
  @Input()
  asterisk = true;

  constructor() {}

  ngOnInit() {}
}
