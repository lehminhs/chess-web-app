import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  gameType: number; //0 is vs player. 1 is vs computer
  gameId: string;
  path = environment.url + '/game'
  gameData: any;

  constructor(private http: HttpClient) {
    this.gameType = -1;
  }

  setGameData(val: string) {
    localStorage.removeItem("gameData");
    localStorage.setItem("gameData", val);
  }

  getGameData() {
    return localStorage.getItem("gameData") as any;
  }

  setGameId(val: string) {
    localStorage.removeItem("gameId");
    localStorage.setItem("gameId", val);
  }

  getGameId() {
    return localStorage.getItem("gameId") as any;
  }

  createGame(whitePlayer: string, blackPlayer: string, gameType: number) {
    return this.http.post(this.path + '/createGame', { whitePlayer, blackPlayer, gameType }).pipe(shareReplay());
  }

  fetchGame(gameId: string) {
    return this.http.get(this.path + '/fetchGame/' + gameId).pipe(shareReplay());
  }

  fetchGames(username: string) {
    return this.http.get(this.path + '/fetchGames', { params: { username: username } }).pipe(shareReplay());
  }

  updateGame(board: any, gameId: string, currentTurn: number, whitePlayer: string, blackPlayer: string, whiteKing: any[], blackKing: any[], canCastleRightWhite: boolean, canCastleLeftWhite: boolean, canCastleRightBlack: boolean, canCastleLeftBlack: boolean, gameType: number, firstMove: number, completed: number, _id: any) {
    return this.http.patch(this.path + '/updateGame/' + gameId, { board, gameId, currentTurn, whitePlayer, blackPlayer, whiteKing, blackKing, canCastleRightWhite, canCastleLeftWhite, canCastleRightBlack, canCastleLeftBlack, gameType, firstMove, completed, _id });
  }
}
