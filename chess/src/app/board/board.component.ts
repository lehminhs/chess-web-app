import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { BoardService } from 'src/services/board.service';
import { AuthService } from 'src/services/auth.service';
import { ErrorService } from 'src/services/error.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  @Output() authenticate: EventEmitter<any> = new EventEmitter();

  inProgress: boolean = true;
  authenticated: boolean = false;

  board: any[] = [];
  flippedBoard: any[] = [];
  normalBoard: any[] = [];
  // playerColor: number = 1; // 1 = White, -1 = Black
  playerKing: number[] = [7, 4];
  opponentKing: number[] = [0, 4];

  needUpdate: boolean = false;
  joiner: boolean = false;

  opponentName: string = '';

  canCastleRight: boolean = true;
  canCastleLeft: boolean = true;
  canCastleRightOp: boolean = true;
  canCastleLeftOp: boolean = true;

  promoting: number[] = [];

  gameType: number = 1 //0 = Singleplayer, 1 = Multiplayer

  selected: any[] = [-1, -1];
  moveable: any[] = [];

  showPromotion: boolean = false;

  promotionQueenIcon: string = '';
  promotionRookIcon: string = '';
  promotionKnightIcon: string = '';
  promotionBishopIcon: string = '';

  lockUp: boolean = false;

  firstMove: number = 0;

  _id: any;
  fetchInterval: any;
  joinInterval: any;

  staticBoard = [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7],
    [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7],
    [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7],
  ]

  sideData: any = {
    whitePlayer: '',
    blackPlayer: '',
    gameId: '',
    completed: 0, // 1 = white win, 0 = still going, 1 = black win, 2 = draw
    currentTurn: 1, // 1 = White, -1 = Black
    playerColor: 0,
    message: '',
    disableResign: false
  }

  whiteKing: any[] = [];
  blackKing: any[] = [];

  constructor(
    private router: Router,
    private boardService: BoardService,
    private authService: AuthService,
    private errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.board = [
      [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
      [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
      [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
      [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
      [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
      [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
      [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }],
      [{ icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }, { icon: 'empty', type: 'empty', color: 0 }]
  ];
    this.fetchGame();

    var baseURL = "./../../../assets/pieces/";

    if (this.sideData.playerColor == 1) {
      this.promotionQueenIcon = baseURL + 'white-queen.png';
      this.promotionRookIcon = baseURL + 'white-rook.png';
      this.promotionKnightIcon = baseURL + 'white-knight.png';
      this.promotionBishopIcon = baseURL + 'white-bishop.png';
    } else {
      this.promotionQueenIcon = baseURL + 'black-queen.png';
      this.promotionRookIcon = baseURL + 'black-rook.png';
      this.promotionKnightIcon = baseURL + 'black-knight.png';
      this.promotionBishopIcon = baseURL + 'black-bishop.png';
    }
  }

  ngOnDestroy() {
    this.clearIntervals();
  }

  clearIntervals() {
    clearInterval(this.fetchInterval);
    clearInterval(this.joinInterval);
  }

  fetchGame() {
    this.sideData.gameId = this.boardService.getGameId();
    this.boardService.fetchGame(this.sideData.gameId)
      .subscribe(
        res => {
          var data: any = res;
          this.boardService.setGameData(JSON.stringify(data));
          this.setGameData();
        },
        error => {
          this.errorService.setErrorMessage(error.message);
          this.router.navigate(['']);
        }
      )
  }

  setGameData() {
    const gameData: any = JSON.parse(this.boardService.getGameData());

    if (!gameData) {
      this.errorService.setErrorMessage('No game data found. Disconnected.')
      this.router.navigate(['']);
      return;
    }

    this._id = gameData._id;

    if (gameData.whitePlayer != this.authService.getUsername() && gameData.blackPlayer != this.authService.getUsername()) {
      this.joiner = true;

      if (gameData.whitePlayer == '-----') {
        this.sideData.whitePlayer = this.authService.getUsername();
        this.sideData.blackPlayer = gameData.blackPlayer;
      } else if (gameData.blackPlayer == '-----') {
        this.sideData.whitePlayer = gameData.whitePlayer;
        this.sideData.blackPlayer = this.authService.getUsername();
      }
    } else {
      this.sideData.whitePlayer = gameData.whitePlayer;
      this.sideData.blackPlayer = gameData.blackPlayer;
    }

    if (this.joiner) {
      this.boardService.updateGame(gameData.board, gameData.id, gameData.currentTurn, this.sideData.whitePlayer, this.sideData.blackPlayer, gameData.whiteKing, gameData.blackKing, gameData.canCastleRightWhite, gameData.canCastleLeftWhite, gameData.canCastleRightBlack, gameData.canCastleLeftBlack, gameData.gameType, gameData.firstMove, gameData.completed, gameData._id)
        .subscribe();

      this.joiner = false;
    }

    if (gameData.whitePlayer == '-----' || gameData.blackPlayer == '-----') {
      this.needUpdate = true;
      this.lockUp = true;

      clearInterval(this.joinInterval);
      this.joinInterval = setInterval(() => {
        this.boardService.fetchGame(this.boardService.getGameId())
          .subscribe(
            res => {
              var data: any = res;
              if (data.whitePlayer != '-----' && data.blackPlayer != '-----') {
                this.needUpdate = false;
                clearInterval(this.joinInterval);
                this.fetchGame();
              }
            }, error => {
              console.log(error);
              this.errorService.setErrorMessage(error.message);
              this.router.navigate(['']);
            }
          )
      }, 10000);

      return;
    }

    if (gameData.whitePlayer == this.authService.getUsername()) {
      this.opponentName = gameData.blackPlayer;
      this.sideData.playerColor = 1;
      this.playerKing = gameData.whiteKing;
      this.opponentKing = gameData.blackKing;
      this.canCastleLeft = gameData.canCastleLeftWhite;
      this.canCastleRight = gameData.canCastleRightWhite;
      this.canCastleLeftOp = gameData.canCastleLeftBlack;
      this.canCastleRightOp = gameData.canCastleRightBlack;
    } else if (gameData.blackPlayer == this.authService.getUsername()) {
      this.opponentName = gameData.whitePlayer;
      this.sideData.playerColor = -1;
      this.playerKing = gameData.blackKing;
      this.opponentKing = gameData.whiteKing;
      this.canCastleLeft = gameData.canCastleLeftBlack;
      this.canCastleRight = gameData.canCastleRightBlack;
      this.canCastleLeftOp = gameData.canCastleLeftWhite;
      this.canCastleRightOp = gameData.canCastleRightWhite;
    } else {
      this.errorService.setErrorMessage('Invalid Game. Aborted.');
      this.router.navigate(['']);
    }

    if (this.sideData.playerColor == 1) {
      this.board = gameData.board;
    } else {
      var tempBoard = [];
      for (let row in gameData.board) {
        tempBoard.unshift(JSON.parse(JSON.stringify(gameData.board[row])).reverse());
      }
      this.board = JSON.parse(JSON.stringify(tempBoard));
      this.normalBoard = JSON.parse(JSON.stringify(gameData.board));

      this.playerKing = [7 - this.playerKing[0], 7 - this.playerKing[1]];
      this.opponentKing = [7 - this.opponentKing[0], 7 - this.opponentKing[1]];
    }

    this.gameType = gameData.gameType;
    this.sideData.completed = gameData.completed;
    this.sideData.currentTurn = gameData.currentTurn;
    this.firstMove = gameData.firstMove;

    if (this.sideData.currentTurn == this.sideData.playerColor) {
      this.lockUp = false;
    } else {
      this.lockUp = true;
    }

    if(this.sideData.completed == -1) {
      this.sideData.message = 'Black Wins!'
      this.sideData.disableResign = true;
    } else if (this.sideData.completed == 1) {
      this.sideData.message = 'White Wins!'
      this.sideData.disableResign = true;
    } else if (this.sideData.completed == 2) {
      this.sideData.message = 'Draw!'
      this.sideData.disableResign = true;
    } else {
      if (this.sideData.currentTurn == -1) {
        this.sideData.message = 'Black to move';
      } else if (this.sideData.currentTurn == 1) {
        this.sideData.message = 'White to move';
      } else {
        this.sideData.message = "Waiting on players";
      }
    }

    clearInterval(this.fetchInterval);
    this.inProgress = false;

    if (this.sideData.completed != 0) {
      this.resetState();
      this.lockUp = true;
      clearInterval(this.fetchInterval);
      clearInterval(this.joinInterval);
      return;
    }

    if (this.gameType == 1) {
      if (this.sideData.playerColor != this.sideData.currentTurn) {
        this.fetchInterval = setInterval(() => {
          this.fetchGame();
        }, 3000)
      } else {
        var isEnd = this.checkEnd();
        if (isEnd.length == 0){
          this.endGame(this.sideData.playerColor * -1);
        }
        this.fetchInterval = setInterval(() => {
          this.fetchGame();
        }, 3000)
      }
    } else if (this.gameType == 0) {
      if (this.firstMove == 0 && this.sideData.playerColor == -1) {
        this.computerMove();
        this.firstMove = 1;
        var blackPlayer = this.authService.getUsername();
        var blackKing = [7 - this.playerKing[0], 7 - this.playerKing[1]];
        var whiteKing = [7 - this.opponentKing[0], 7 - this.opponentKing[1]];

        var tempBoard = [];
        for (let row in this.board) {
          tempBoard.unshift(JSON.parse(JSON.stringify(this.board[row])).reverse());
        }

        this.boardService.updateGame(tempBoard, this.sideData.gameId, this.sideData.currentTurn, "Chess AI", blackPlayer, whiteKing, blackKing, this.canCastleRightOp, this.canCastleLeftOp, this.canCastleRight, this.canCastleLeft, this.gameType, this.firstMove, this.sideData.completed, this._id)
          .subscribe();
      }

      this.lockUp = false;
      this.sideData.currentTurn = -1;
    } else {
      this.errorService.setErrorMessage('Invalid Game Type');
      this.router.navigate(['']);
    }
  }

  //Handler function connected to (click) binding
  clickHandler(r: number, c: number) {
    if (this.lockUp) {
      return;
    }

    if (this.selected[0] == -1) {
      this.selected = [r, c];
      this.moveable = this.checkAvailableMoves(r, c, this.board[r][c]);
    } else {
      if (this.sideData.playerColor == 1) {
        var whitePlayer: string = this.authService.getUsername();
        var blackPlayer: string = this.opponentName;
        var whiteKing: any[] = this.playerKing;
        var blackKing: any[] = this.opponentKing;
        var canCastleLeftWhite = this.canCastleLeft;
        var canCastleRightWhite = this.canCastleRight;
        var canCastleLeftBlack = this.canCastleLeftOp;
        var canCastleRightBlack = this.canCastleRightOp;
      } else {
        var blackPlayer: string = this.authService.getUsername();
        var whitePlayer: string = this.opponentName;
        var whiteKing: any[] = [7 - this.opponentKing[0], 7 - this.opponentKing[1]];
        var blackKing: any[] = [7 - this.playerKing[0], 7 - this.playerKing[1]];
        var canCastleLeftWhite = this.canCastleLeftOp;
        var canCastleRightWhite = this.canCastleRightOp;
        var canCastleLeftBlack = this.canCastleLeft;
        var canCastleRightBlack = this.canCastleRight;
      }

      for (let move in this.moveable) {
        if (this.moveable[move][0] == r && this.moveable[move][1] == c) {
          if (this.moveable[move].length == 3) {
           this.castleHelper(this.moveable[move], this.sideData.playerColor, true);
          } else {
            this.move(this.selected[0], this.selected[1], r, c);
          }
          if (r == 0 && this.board[r][c].type == 'pawn') {
            this.showPromotion = true;
            this.promoting = [r, c];
          }
          if (this.board[r][c].type == 'king') {
            this.playerKing = [r, c];
            this.canCastleRight = false;
            this.canCastleLeft = false;
          } else if (this.board[r][c].type == 'rook') {
            if (this.board[0][7].type == 'empty') {
              this.canCastleLeft = false;
            }
            if (this.board[7][7].type == 'empty') {
              this.canCastleRight = false;
            }
          }

          if (this.gameType == 0) {
            this.computerMove();
          } else {
            this.sideData.currentTurn *= -1;
          }

          this.firstMove = 1;
          if (this.sideData.playerColor == -1) {
            var tempBoard = [];

            for (let row in this.board) {
              tempBoard.unshift(JSON.parse(JSON.stringify(this.board[row])).reverse());
            }

            this.boardService.updateGame(tempBoard, this.sideData.gameId, this.sideData.currentTurn, whitePlayer, blackPlayer, whiteKing, blackKing, canCastleRightWhite, canCastleLeftWhite, canCastleRightBlack, canCastleLeftBlack, this.gameType, this.firstMove, this.sideData.completed, this._id)
              .subscribe();
          } else {
            this.boardService.updateGame(this.board, this.sideData.gameId, this.sideData.currentTurn, whitePlayer, blackPlayer, whiteKing, blackKing, canCastleRightWhite, canCastleLeftWhite, canCastleRightBlack, canCastleLeftBlack, this.gameType, this.firstMove, this.sideData.completed, this._id)
              .subscribe();
          }

          clearInterval(this.fetchInterval);
          if (this.gameType == 1) {
            this.lockUp = true;
            this.fetchInterval = setInterval(() => {
              this.fetchGame();
            }, 5000);
          }

          break;
        }
      }

      this.resetState();
    }
  }

  //Checks the available moves of the clicked square depending on type
  checkAvailableMoves(r: number, c: number, data: { icon: string, type: string, color: number }) {
    if (data.color != this.sideData.playerColor || data.type == 'empty') {
      this.resetState();
      return;
    }

    var unfilteredMoves: any[] = [];

    if (data.type == 'pawn') {
      unfilteredMoves = this.pawnMoves(r, c, this.sideData.playerColor);
    } else if (data.type == 'knight') {
      unfilteredMoves = this.knightMoves(r, c, this.sideData.playerColor);
    } else if (data.type == 'bishop') {
      unfilteredMoves = this.bishopMoves(r, c, this.sideData.playerColor);
    } else if (data.type == 'rook') {
      unfilteredMoves = this.rookMoves(r, c, this.sideData.playerColor);
    } else if (data.type == 'king') {
      unfilteredMoves = this.kingMoves(r, c, this.sideData.playerColor);
    } else if (data.type == 'queen') {
      unfilteredMoves = this.queenMoves(r, c, this.sideData.playerColor);
    }

    var output = this.suicideFilter(r, c, unfilteredMoves, this.sideData.playerColor, [this.playerKing[0], this.playerKing[1]]);

    return output;
  }

  //Resets the selected square and moveable list
  resetState() {
    this.selected = [-1, -1];
    this.moveable = [];
  }

  //Move the piece by updating the squares
  move(r_prev: number, c_prev: number, r_next: number, c_next: number) {
    this.board[r_next][c_next].icon = this.board[r_prev][c_prev].icon;
    this.board[r_next][c_next].type = this.board[r_prev][c_prev].type;
    this.board[r_next][c_next].color = this.board[r_prev][c_prev].color;

    this.board[r_prev][c_prev].icon = 'empty.png';
    this.board[r_prev][c_prev].type = 'empty';
    this.board[r_prev][c_prev].color = 0;
  }

  //Checks and highlights the squares that are in moveable list
  highlightHelper(r: number, c: number) {
    for (let move in this.moveable) {
      if (this.moveable[move][0] == r && this.moveable[move][1] == c) {
        return true;
      }
    }
    return false;
  }

  //Filter out moves behind an existing piece
  moveFilter(r: number, c: number, color: number) {
    if (this.board[r][c].type == 'empty') {
      return 1; //The square is empty
    } else if (this.board[r][c].color * -1 == color) {
      return 0; //The square has an opponent piece
    }
    return -1; //The square has a friendly piece
  }

  //Filter out moves that put player into check
  suicideFilter(r: number, c: number, moves: any[], color: number, kingPosition: any[]) {
    var currentBoard = JSON.parse(JSON.stringify(this.board));
    var pMoves = JSON.parse(JSON.stringify(moves));

    var iter = 0;
    while (iter < pMoves.length) {
      this.move(r, c, pMoves[iter][0], pMoves[iter][1]);
      if (this.board[pMoves[iter][0]][pMoves[iter][1]].type == 'king' && this.board[pMoves[iter][0]][pMoves[iter][1]].color == color) {
        var isChecked: boolean = this.checkedHelper(pMoves[iter][0], pMoves[iter][1], color).checked;
      } else {
        var isChecked: boolean = this.checkedHelper(kingPosition[0], kingPosition[1], color).checked;
      }

      if (isChecked) {
        pMoves.splice(iter, 1);
      } else {
        iter++;
      }

      this.board = JSON.parse(JSON.stringify(currentBoard));
    }

    return pMoves;
  }

  //Fills in global moveable list with possible pawn moves
  pawnMoves(r: number, c: number, color: number) {
    var movesUp: any[] = [];
    var movesDiag: any[] = [];

    if ((r - 1) >= 0) {
      if (this.board[r - 1][c].type == 'empty') {
        movesUp.push([r - 1, c]);
        if (r == 6 && this.board[4][c].type == 'empty') {
          movesUp.push([r - 2, c]);
        }
      }
      if ((c - 1) >= 0 && this.board[r - 1][c - 1].color * -1 == color) {
        movesDiag.push([r - 1, c - 1]);
      }
      if ((c + 1) < 8 && this.board[r - 1][c + 1].color * -1 == color) {
        movesDiag.push([r - 1, c + 1]);
      }
    }

    return movesUp.concat(movesDiag);
  }

  //Fills in global moveable list with possible knight moves
  knightMoves(r: number, c: number, color: number) {
    var moves: any[] = [];

    if ((r - 2) >= 0) {
      if ((c - 1) >= 0 && this.moveFilter(r - 2, c - 1, color) >= 0) {
        moves.push([r - 2, c - 1]);
      }
      if ((c + 1) < 8 && this.moveFilter(r - 2, c + 1, color) >= 0) {
        moves.push([r - 2, c + 1]);
      }
    }

    if ((r - 1) >= 0) {
      if ((c - 2) >= 0 && this.moveFilter(r - 1, c - 2, color) >= 0) {
        moves.push([r - 1, c - 2]);
      }
      if ((c + 2) < 8 && this.moveFilter(r - 1, c + 2, color) >= 0) {
        moves.push([r - 1, c + 2]);
      }
    }

    if ((r + 1) < 8) {
      if ((c - 2) >= 0 && this.moveFilter(r + 1, c - 2, color) >= 0) {
        moves.push([r + 1, c - 2]);
      }
      if ((c + 2) < 8 && this.moveFilter(r + 1, c + 2, color) >= 0) {
        moves.push([r + 1, c + 2]);
      }
    }

    if ((r + 2) < 8) {
      if ((c - 1) >= 0 && this.moveFilter(r + 2, c - 1, color) >= 0) {
        moves.push([r + 2, c - 1]);
      }
      if ((c + 1) < 8 && this.moveFilter(r + 2, c + 1, color) >= 0) {
        moves.push([r + 2, c + 1]);
      }
    }

    return moves;
  }

  //Fills in global moveable list with possible bishop moves
  bishopMoves(r: number, c: number, color: number) {
    var movesNW: any[] = [];
    var movesNE: any[] = [];
    var movesSW: any[] = [];
    var movesSE: any[] = [];

    var currentR: number = r;
    var currentC: number = c;

    while ((currentR) > 0 && (currentC) > 0) {
      currentR -= 1;
      currentC -= 1;

      if (this.moveFilter(currentR, currentC, color) >= 0) {
        movesNW.push([currentR, currentC]);

        if (this.moveFilter(currentR, currentC, color) == 0) {
          break;
        }
      } else {
        break;
      }
    }

    currentR = r;
    currentC = c;

    while ((currentR) > 0 && (currentC) < 7) {
      currentR -= 1;
      currentC += 1;

      if (this.moveFilter(currentR, currentC, color) >= 0) {
        movesNE.push([currentR, currentC]);

        if (this.moveFilter(currentR, currentC, color) == 0) {
          break;
        }
      } else {
        break;
      }
    }

    currentR = r;
    currentC = c;

    while ((currentR) < 7 && (currentC) < 7) {
      currentR += 1;
      currentC += 1;

      if (this.moveFilter(currentR, currentC, color) >= 0) {
        movesSE.push([currentR, currentC]);

        if (this.moveFilter(currentR, currentC, color) == 0) {
          break;
        }
      } else {
        break;
      }
    }

    currentR = r;
    currentC = c;
    while ((currentR) < 7 && (currentC) > 0) {
      currentR += 1;
      currentC -= 1;

      if (this.moveFilter(currentR, currentC, color) >= 0) {
        movesSW.push([currentR, currentC]);

        if (this.moveFilter(currentR, currentC, color) == 0) {
          break;
        }
      } else {
        break;
      }
    }

    return movesNW.concat(movesNE).concat(movesSW).concat(movesSE);
  }

  //Fills in global moveable list with possible rook moves
  rookMoves(r: number, c: number, color: number) {
    var movesN: any[] = [];
    var movesE: any[] = [];
    var movesS: any[] = [];
    var movesW: any[] = [];

    var currentR: number = r;
    var currentC: number = c;

    while ((currentR) > 0) {
      currentR -= 1;

      if (this.moveFilter(currentR, currentC, color) >= 0) {
        movesN.push([currentR, currentC]);

        if (this.moveFilter(currentR, currentC, color) == 0) {
          break;
        }
      } else {
        break;
      }
    }

    currentR = r;

    while ((currentC) < 7) {
      currentC += 1;

      if (this.moveFilter(currentR, currentC, color) >= 0) {
        movesW.push([currentR, currentC]);

        if (this.moveFilter(currentR, currentC, color) == 0) {
          break;
        }
      } else {
        break;
      }
    }

    currentC = c;

    while ((currentR) < 7) {
      currentR += 1;

      if (this.moveFilter(currentR, currentC, color) >= 0) {
        movesS.push([currentR, currentC]);

        if (this.moveFilter(currentR, currentC, color) == 0) {
          break;
        }
      } else {
        break;
      }
    }

    currentR = r;

    while ((currentC) > 0) {
      currentC -= 1;

      if (this.moveFilter(currentR, currentC, color) >= 0) {
        movesE.push([currentR, currentC]);

        if (this.moveFilter(currentR, currentC, color) == 0) {
          break;
        }
      } else {
        break;
      }
    }

    return movesN.concat(movesW).concat(movesS).concat(movesE);
  }

  //Fills in global moveable list with possible king moves
  kingMoves(r: number, c: number, color: number) {
    var moves: any[] = [];

    if ((r - 1) >= 0) {
      if (this.moveFilter(r - 1, c, color) >= 0) {
        moves.push([r - 1, c]);
      }

      if ((c - 1) >= 0) {
        if (this.moveFilter(r - 1, c - 1, color) >= 0) {
          moves.push([r - 1, c - 1]);
        }
      }
      if ((c + 1) < 8) {
        if (this.moveFilter(r - 1, c + 1, color) >= 0) {
          moves.push([r - 1, c + 1]);
        }
      }
    }

    if ((r + 1) < 8) {
      if (this.moveFilter(r + 1, c, color) >= 0) {
        moves.push([r + 1, c]);
      }
      if ((c - 1) >= 0) {
        if (this.moveFilter(r + 1, c - 1, color) >= 0) {
          moves.push([r + 1, c - 1]);
        }
      }
      if ((c + 1) < 8) {
        if (this.moveFilter(r + 1, c + 1, color) >= 0) {
          moves.push([r + 1, c + 1]);
        }
      }
    }

    if ((c - 1) >= 0) {
      if (this.moveFilter(r, c - 1, color) >= 0) {
        moves.push([r, c - 1]);
      }
    }

    if ((c + 1) < 8) {
      if (this.moveFilter(r, c + 1, color) >= 0) {
        moves.push([r, c + 1]);
      }
    }

    var isPlayer = color == this.sideData.playerColor;
    var castleMoves: any[] = this.addCastleMove(this.sideData.playerColor, isPlayer);

    return moves.concat(castleMoves);
  }

  //Fills in global moveable list with possible queen moves
  queenMoves(r: number, c: number, color: number) {
    var bishopMoves = this.bishopMoves(r, c, color);
    var rookMoves = this.rookMoves(r, c, color);

    return bishopMoves.concat(rookMoves);
  }

  checkedHelper(r: number, c: number, color: number) {
    var master: { checked: boolean, checkedBy: any[] } = {
      checked: false,
      checkedBy: []
    }

    var bishopMoves = this.bishopMoves(r, c, color);
    for (let move in bishopMoves) {
      if (this.board[bishopMoves[move][0]][bishopMoves[move][1]].type == 'bishop'
        || this.board[bishopMoves[move][0]][bishopMoves[move][1]].type == 'queen'
        || (this.board[bishopMoves[move][0]][bishopMoves[move][1]].type == 'pawn'
          && r - 1 == bishopMoves[move][0])) {
        master.checked = true;
        master.checkedBy.push([bishopMoves[move][0], bishopMoves[move][1]]);
      }
    }

    var rookMoves = this.rookMoves(r, c, color);
    for (let move in rookMoves) {
      if (this.board[rookMoves[move][0]][rookMoves[move][1]].type == 'rook'
        || this.board[rookMoves[move][0]][rookMoves[move][1]].type == 'queen') {
        master.checked = true;
        master.checkedBy.push([rookMoves[move][0], rookMoves[move][1]]);
      }
    }

    var knightMoves = this.knightMoves(r, c, color);
    for (let move in knightMoves) {
      if (this.board[knightMoves[move][0]][knightMoves[move][1]].type == 'knight') {
        master.checked = true;
        master.checkedBy.push([knightMoves[move][0], knightMoves[move][1]]);
      }
    }

    return master;
  }

  addCastleMove(color: number, isPlayer: boolean) {
    if (isPlayer) {
      var condLeft = this.canCastleLeft;
      var condRight = this.canCastleRight;
    } else {
      var condLeft = this.canCastleLeftOp;
      var condRight = this.canCastleRightOp;
    }
    var castleMoves: any[] = [];
    if (color == 1) {
      if (condLeft) {
        if (this.board[7][1].type == 'empty'
          && this.board[7][2].type == 'empty'
          && this.board[7][3].type == 'empty'
          && !this.checkedHelper(7, 1, color).checked
          && !this.checkedHelper(7, 2, color).checked
          && !this.checkedHelper(7, 3, color).checked) {
          castleMoves.push([7, 2, -1]);
        }
      }

      if (condRight) {
        if (this.board[7][5].type == 'empty'
          && this.board[7][6].type == 'empty'
          && !this.checkedHelper(7, 5, color).checked
          && !this.checkedHelper(7, 6, color).checked) {
          castleMoves.push([7, 6, 1]);
        }
      }
    } else if (color == -1) {
      if (condLeft) {
        if (this.board[7][1].type == 'empty'
          && this.board[7][2].type == 'empty'
          && !this.checkedHelper(7, 1, color).checked
          && !this.checkedHelper(7, 2, color).checked) {
          castleMoves.push([7, 1, -1]);
        }
      }

      if (condRight) {
        if (this.board[7][4].type == 'empty'
          && this.board[7][5].type == 'empty'
          && this.board[7][6].type == 'empty'
          && !this.checkedHelper(7, 4, color).checked
          && !this.checkedHelper(7, 5, color).checked
          && !this.checkedHelper(7, 6, color).checked) {
          castleMoves.push([7, 5, 1]);
        }
      }
    }

    return castleMoves;
  }

  castleHelper(kingEnd: any[], color: number, isPlayer: boolean) {
    if (isPlayer) {
      this.move(this.playerKing[0], this.playerKing[1], kingEnd[0], kingEnd[1]);
      this.playerKing = [kingEnd[0], kingEnd[1]];
      if (color == 1) {
        if (kingEnd[2] == -1) {
          this.move(this.playerKing[0], this.playerKing[1] - 2, this.playerKing[0], this.playerKing[1] + 1);
        } else if (kingEnd[2] == 1) {
          this.move(this.playerKing[0], this.playerKing[1] + 1, this.playerKing[0], this.playerKing[1] - 1);
        } else {
          console.log('incorrect castleHelper input');
        }
      } else if (color == -1) {
        if (kingEnd[2] == -1) {
          this.move(this.playerKing[0], this.playerKing[1] - 1, this.playerKing[0], this.playerKing[1] + 1);
        } else if (kingEnd[2] == 1) {
          this.move(this.playerKing[0], this.playerKing[1] + 2, this.playerKing[0], this.playerKing[1] - 1);
        } else {
          console.log('incorrect castleHelper input');
        }
      }
    } else {
      this.move(this.opponentKing[0], this.opponentKing[1], kingEnd[0], kingEnd[1]);
      this.opponentKing = [kingEnd[0], kingEnd[1]];
      if (color == 1) {
        if (kingEnd[2] == -1) {
          this.move(this.opponentKing[0], this.opponentKing[1] - 2, this.opponentKing[0], this.opponentKing[1] + 1);
        } else if (kingEnd[2] == 1) {
          this.move(this.opponentKing[0], this.opponentKing[1] + 1, this.opponentKing[0], this.opponentKing[1] - 1);
        } else {
          console.log('incorrect castleHelper input');
        }
      } else if (color == -1) {
        if (kingEnd[2] == -1) {
          this.move(this.opponentKing[0], this.opponentKing[1] + 1, this.opponentKing[0], this.opponentKing[1] - 1);
        } else if (kingEnd[2] == 1) {
          this.move(this.opponentKing[0], this.opponentKing[1] - 2, this.opponentKing[0], this.opponentKing[1] + 1);
        } else {
          console.log('incorrect castleHelper input');
        }
      }
    }

    this.canCastleLeft = false;
    this.canCastleRight = false;
  }

  promote(r: number, c: number, type: string, color: number) {
    if (color == -1) {
      var icon = 'black-' + type;
    } else if (color == 1) {
      var icon = 'white-' + type;
    } else {
      var icon = 'empty'
    }

    this.board[r][c] = {
      icon: icon,
      type: type,
      color: color
    }

    this.promoting = [];
    this.showPromotion = false;
  }

  // -- COMPUTER OPPONENT HELPERS -- //

  //Flip board so computer can analyze move
  flipBoard() {
    this.flippedBoard = [];

    for (let row in this.board) {
      this.flippedBoard.unshift(JSON.parse(JSON.stringify(this.board[row])).reverse());
    }

    this.normalBoard = JSON.parse(JSON.stringify(this.board));
    this.board = JSON.parse(JSON.stringify(this.flippedBoard));
  }

  resetBoard() {
    this.board = JSON.parse(JSON.stringify(this.normalBoard));
  }

  //Handle the computer move
  computerMove() {
    this.flipBoard();

    var randomPiece = this.randomPieceHelper();

    if (randomPiece.moves.length == 0) {
      if (this.checkedHelper(this.opponentKing[0], this.opponentKing[1], this.sideData.playerColor * -1)) {
        this.endGame(this.sideData.playerColor);
      } else {
        this.endGame(2);
      }

      return;
    }

    var randomMove = Math.floor(Math.random() * randomPiece.moves.length);

    if (randomPiece.type == 'king') {
      this.opponentKing = [7 - randomPiece.rowPos, 7 - randomPiece.colPos];
    }

    this.resetBoard();
    if (randomPiece.moves[randomMove].length == 3) {
      this.castleHelper([7 - randomPiece.moves[randomMove][0], 7 - randomPiece.moves[randomMove][1], randomPiece.moves[randomMove][2]], this.sideData.playerColor * -1, false);
    } else {
      this.move(7 - randomPiece.rowPos, 7 - randomPiece.colPos, 7 - randomPiece.moves[randomMove][0], 7 - randomPiece.moves[randomMove][1]);
      if (randomPiece.type == 'king') {
        this.opponentKing = [7 - randomPiece.moves[randomMove][0], 7 - randomPiece.moves[randomMove][1]];
      }
    }

    if (randomPiece.type == 'pawn' && 7 - randomPiece.moves[randomMove][0] == 7) {
      this.promote(7 - randomPiece.moves[randomMove][0], 7 - randomPiece.moves[randomMove][1], 'queen', this.sideData.playerColor * -1)
    }
  }

  endGame(val: number) {
    this.sideData.completed = val;

    if (this.sideData.playerColor == 1) {
      var whitePlayer: string = this.authService.getUsername();
      var blackPlayer: string = this.opponentName;
      var whiteKing: any[] = this.playerKing;
      var blackKing: any[] = this.opponentKing;
      var canCastleLeftWhite = this.canCastleLeft;
      var canCastleRightWhite = this.canCastleRight;
      var canCastleLeftBlack = this.canCastleLeftOp;
      var canCastleRightBlack = this.canCastleRightOp;
    } else {
      var blackPlayer: string = this.authService.getUsername();
      var whitePlayer: string = this.opponentName;
      var whiteKing: any[] = [7 - this.opponentKing[0], 7 - this.opponentKing[1]];
      var blackKing: any[] = [7 - this.playerKing[0], 7 - this.playerKing[1]];
      var canCastleLeftWhite = this.canCastleLeftOp;
      var canCastleRightWhite = this.canCastleRightOp;
      var canCastleLeftBlack = this.canCastleLeft;
      var canCastleRightBlack = this.canCastleRight;
    }

    this.resetBoard();

    if (this.sideData.playerColor == -1) {
      var tempBoard = [];

      for (let row in this.board) {
        tempBoard.unshift(JSON.parse(JSON.stringify(this.board[row])).reverse());
      }

      this.boardService.updateGame(tempBoard, this.sideData.gameId, this.sideData.currentTurn, whitePlayer, blackPlayer, whiteKing, blackKing, canCastleRightWhite, canCastleLeftWhite, canCastleRightBlack, canCastleLeftBlack, this.gameType, this.firstMove, this.sideData.completed, this._id)
        .subscribe(
          res => {
            console.log('ended game');
            this.fetchGame()
          }
        );
    } else {
      this.boardService.updateGame(this.board, this.sideData.gameId, this.sideData.currentTurn, whitePlayer, blackPlayer, whiteKing, blackKing, canCastleRightWhite, canCastleLeftWhite, canCastleRightBlack, canCastleLeftBlack, this.gameType, this.firstMove, this.sideData.completed, this._id)
        .subscribe(
          res => {
            console.log('ended game');
            this.fetchGame();
          }
        );
    }

    clearInterval(this.fetchInterval);
    if (this.gameType == 0) {
      this.lockUp = true;
      this.fetchInterval = setInterval(() => {
        this.fetchGame();
      }, 5000);
    }

    this.resetState();
    this.lockUp = true;
  }

  //Pick a random computer piece
  randomPieceHelper() {
    var board = JSON.parse(JSON.stringify(this.staticBoard));
    var picking: boolean = true;
    var index: number = -1;
    var finalMoveable = [];
    while (picking) {
      index = Math.floor(Math.random() * board.length);
      var piece = this.board[board[index][0]][board[index][1]];
      if (piece.color == this.sideData.playerColor * -1) {
        var unfilteredMoves: any[] = [];

        if (piece.type == 'pawn') {
          unfilteredMoves = this.pawnMoves(board[index][0], board[index][1], this.sideData.playerColor * -1);
        } else if (piece.type == 'knight') {
          unfilteredMoves = this.knightMoves(board[index][0], board[index][1], this.sideData.playerColor * -1);
        } else if (piece.type == 'bishop') {
          unfilteredMoves = this.bishopMoves(board[index][0], board[index][1], this.sideData.playerColor * -1);
        } else if (piece.type == 'rook') {
          unfilteredMoves = this.rookMoves(board[index][0], board[index][1], this.sideData.playerColor * -1);
        } else if (piece.type == 'king') {
          unfilteredMoves = this.kingMoves(board[index][0], board[index][1], this.sideData.playerColor * -1);
        } else if (piece.type == 'queen') {
          unfilteredMoves = this.queenMoves(board[index][0], board[index][1], this.sideData.playerColor * -1);
        }

        finalMoveable = this.suicideFilter(board[index][0], board[index][1], unfilteredMoves, this.sideData.playerColor * -1, [7 - this.opponentKing[0], 7 - this.opponentKing[1]]);

        if (finalMoveable.length > 0) {
          picking = false;
          break;
        }
      }

      board.splice(index, 1);
      if (board.length == 0) {
        picking = false;
        break;
      }
    }

    if (finalMoveable.length > 0) {
      return {
        moves: finalMoveable,
        rowPos: board[index][0],
        colPos: board[index][1],
        type: this.board[board[index][0]][board[index][1]].type
      };
    } else {
      return {
        moves: finalMoveable,
        rowPos: -1,
        colPos: -1,
        type: 'empty'
      };
    }
  }

  checkEnd() {
    var moveable: any[] = [];
    for(let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c].type == 'empty' || this.board[r][c].color == this.sideData.playerColor * -1) {
          continue;
        } else {
          var temp = this.checkAvailableMoves(r, c, this.board[r][c]);
          moveable = moveable.concat(JSON.parse(JSON.stringify(temp)));
        }
      }
    }

    return moveable;
  }

  //INTERFACE FUNCTIONS
  handleBack() {
    return;
  }
}
