import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  errorMessage = '';

  constructor() { }

  setErrorMessage(val: string) {
    this.errorMessage = val;
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}
