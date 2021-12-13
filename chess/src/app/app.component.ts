import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { filter } from 'rxjs/operators';
import { Router, RoutesRecognized } from '@angular/router';

import { BoardService } from 'src/services/board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isAuthenticated: boolean = false;
  mainTitle = 'Chess App';
  title: string = '';
  routeData: any;

  username: string;
  // currentRoute: string;
  // routeSubscription: subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated = this.authService.isAuthenticated;

    router.events.pipe(
      filter(event => event instanceof RoutesRecognized)
    ).subscribe((event: any) => {
      if (event.state.root.firstChild != null) {
        this.routeData = event.state.root.firstChild.data;
        this.title = this.routeData.title;

        if (this.routeData.type != 'auth') {
          this.handleAuth();
          this.isAuthenticated = this.authService.isAuthenticated;
        } else {
          this.isAuthenticated = false;
        }
      }
    });
  }

  handleAuth() {
    if (this.authService.isLoggedOut()) {
      this.logout();
    } else {
      this.authService.setIsAuthenticated(true);
      this.authService.setUsername();
      this.username = this.authService.getUsername();
      this.authService.setUserId();
    }
  }

  logout() {
    this.authService.logout();
    this.authService.setIsAuthenticated(false);
    this.router.navigate(['login']);
  }
}
