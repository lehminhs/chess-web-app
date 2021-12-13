import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardComponent } from './board/board.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { HttpClientModule } from '@angular/common/http';
import { MainMenuComponent } from './main-menu/main-menu.component';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    data: { title: 'Main Menu', type: 'ingame' }
  },
  {
    path: 'board',
    component: BoardComponent,
    data: { title: 'board', type: 'ingame' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'login', type: 'auth' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'register', type: 'auth' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
