import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/services/auth.service';
import { ErrorService } from 'src/services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {

  form: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const val = this.form.value;
    if (val.username && val.password) {
      this.authService.signin(val.username, val.password)
        .subscribe(
          res => {
            console.log("User is logged in");
            this.authService.setSession(res);

            this.router.navigateByUrl('/');
          },
          error => {
            this.errorService.setErrorMessage(error.message);
          }
        );
    }
  }
}
