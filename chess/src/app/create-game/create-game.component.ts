import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { BoardService } from 'src/services/board.service';
import { AuthService } from 'src/services/auth.service';
import { ErrorService } from 'src/services/error.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {
  colorChoice: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { gameType: number },
    private boardService: BoardService,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router,
    private dialogRef: MatDialogRef<CreateGameComponent>
  ) { }

  ngOnInit(): void {
  }

  setColor(val: number) {
    this.colorChoice = val;
  }

  createGame() {
    const username = this.authService.getUsername();
    var whiteName: any = '';
    var blackName: any = '';

    if (this.colorChoice == 2) {
      var color = Math.floor(Math.random() + 1);
    } else {
      var color = this.colorChoice;
    }

    if (color == 0) {
      whiteName = username;
      if (this.data.gameType == 0) {
        blackName = 'Chess AI';
      } else if (this.data.gameType == 1) {
        blackName = '-----';
      } else {
        console.log('Invalid Game Type');
      }
    } else if (color == 1) {
      blackName = username;
      if (this.data.gameType == 0) {
        whiteName = 'Chess AI';
      } else if (this.data.gameType == 1) {
        whiteName = '-----';
      } else {
        console.log('Invalid Game Type');
      }
    }

    this.boardService.createGame(whiteName, blackName, this.data.gameType)
      .subscribe(
        res => {
          const data: any = res;
          this.boardService.setGameId(data.result.gameId);

          this.router.navigate(['board']);
          this.dialogRef.close();
        },
        error => {
          this.errorService.setErrorMessage(error.message);
          console.log(error.message);
        }
      );
  }
}
