import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

  loadGame() {
    
  }
}
