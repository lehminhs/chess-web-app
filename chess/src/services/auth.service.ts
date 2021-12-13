import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';

import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  path = environment.url + '/user';

  isAuthenticated: boolean;
  username: any;
  userId: any;

  constructor(private http: HttpClient) {
    this.isAuthenticated = false;
  }

  setIsAuthenticated(val: boolean) {
    this.isAuthenticated = val;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  signin(username: string, password: string) {
    return this.http.post(this.path + '/signin', { username, password }).pipe(shareReplay());
  }

  signup(username: string, password: string, confirmPassword: string) {
    return this.http.post(this.path + '/signup', { username, password, confirmPassword }).pipe(shareReplay());
  }

  setSession(authResult: any) {
    const decodedToken: any = jwt_decode(authResult.token);
    const expiresAt = moment().add(decodedToken.exp, 'second');

    localStorage.setItem("token", authResult.token);
    localStorage.setItem('id_token', decodedToken.id);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("username", decodedToken.username);
  }

  getToken() {
    const token = localStorage.getItem("token");
    return token;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    if(this.getExpiration()) {
      return moment().isBefore(this.getExpiration());
    } else {
      return false;
    }
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      return moment(Date.now()).subtract(1, 'd');
    }
  }

  setUsername() {
    this.username = localStorage.getItem("username");
  }

  getUsername() {
    return this.username;
  }

  setUserId() {
    this.userId =  localStorage.getItem("id_token");
  }

  getUserId() {
    return this.userId;
  }
}