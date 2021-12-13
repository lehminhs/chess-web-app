import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateGameComponent } from '../create-game/create-game.component';
import { JoinGameComponent } from '../join-game/join-game.component';

import { ErrorService } from 'src/services/error.service';
import { BoardService } from 'src/services/board.service';
import { AuthService } from 'src/services/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  errorMessage: string = '';
  openGames: any[] = [];

  constructor(
    private boardService: BoardService,
    private errorService: ErrorService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.fetchGames();
  }

  fetchGames() {
    this.boardService.fetchGames(this.authService.getUsername())
      .subscribe(
        res => {
          var data: any = res;
          this.openGames = data.whiteGames.concat(data.blackGames);
        },
        error => {
          this.errorService.setErrorMessage(error.message)
        }
      )
  }

  handleCreateGame() {
    let dialogRef = this.dialog.open(CreateGameComponent, {
      height: '400px',
      width: '600px',
      data: { gameType: 1 }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.errorMessage = this.errorService.getErrorMessage();
    });
  }

  handleComputerGame() {
    let dialogRef = this.dialog.open(CreateGameComponent, {
      height: 'auto',
      width: 'auto',
      data: { gameType: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.errorMessage = this.errorService.getErrorMessage();
    });
  }

  handleJoinGameWithCode() {
    let dialogRef = this.dialog.open(JoinGameComponent, {
      height: 'auto',
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.errorMessage = this.errorService.getErrorMessage();
    });
  }

  joinGameFromCard(code: string) {
    this.boardService.setGameId(code);
    this.router.navigate(['board']);
  }
}
