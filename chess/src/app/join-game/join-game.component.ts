import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BoardService } from 'src/services/board.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
  code: string = '';
  hasError: boolean = false;
  disabledJoin: boolean = true;

  constructor(
    private boardService: BoardService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  checkJoinable() {
    if (this.code.length == 7) {
      this.disabledJoin = false;
    } else {
      this.disabledJoin = true;
    }
  }

  joinGame() {
    this.boardService.setGameId(this.code);
    this.router.navigate(['board']);
  }
}
