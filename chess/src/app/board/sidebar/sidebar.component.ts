import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from 'src/services/board.service';
import { AuthService } from 'src/services/auth.service';
import { ErrorService } from 'src/services/error.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() data: any;
  message: string = '';
  disableResign: boolean = false;

  constructor(
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
  }

  handleResign() {
    var gameData = JSON.parse(this.boardService.getGameData());
    var completed = this.data.playerColor * -1;

    this.boardService.updateGame(gameData.board, gameData.gameId, gameData.currentTurn, gameData.whitePlayer, gameData.blackPlayer, gameData.whiteKing, gameData.blackKing, gameData.canCastleRightWhite, gameData.canCastleLeftWhite, gameData.canCastleRightBlack, gameData.canCastleLeftBlack, gameData.gameType, gameData.firstMove, completed, gameData._id)
      .subscribe(
        res => {
          this.disableResign = true;
          if (this.data.playerColor == -1) {
            this.data.message = "White Wins!";
            this.data.disableResign = true;
          } else if (this.data.playerColor == 1) {
            this.data.message = "Black Wins!";
            this.data.disableResign = true;
          }
        }
      );
  }
}
