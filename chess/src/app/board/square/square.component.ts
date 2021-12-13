import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  @Input() position : any[];
  @Input() highlighted : boolean;
  @Input() data: {
    icon: string
    type: string,
    color: number
  };
  color : String;
  piecePath: String;
  constructor() { }

  ngOnInit(): void {
    if ((this.position[0] + this.position[1]) % 2 == 0) {
      this.color = 'white';
    } else {
      this.color = 'black';
    }
  }
}
