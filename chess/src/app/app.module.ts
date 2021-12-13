import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser'; 
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AuthInterceptor } from './auth.intercepter';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { SquareComponent } from './board/square/square.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CreateGameComponent } from './create-game/create-game.component';

import { AuthService } from 'src/services/auth.service';
import { BoardService } from 'src/services/board.service';
import { ErrorService } from 'src/services/error.service';
import { JoinGameComponent } from './join-game/join-game.component';
import { GameCardComponent } from './main-menu/game-card/game-card.component';
import { SidebarComponent } from './board/sidebar/sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SquareComponent,
    InfoPanelComponent,
    LoginComponent,
    RegisterComponent,
    MainMenuComponent,
    CreateGameComponent,
    JoinGameComponent,
    GameCardComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AuthService,
    BoardService,
    ErrorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
