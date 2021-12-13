import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  errorMessage: string = '';
  form: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  register() {
    const val = this.form.value;

    if (val.username && val.password && val.confirmPassword) {
      this.authService.signup(val.username, val.password, val.confirmPassword)
        .subscribe(
          () => {
            console.log("Registration Complete");
            this.router.navigateByUrl('/login');
          }
        );
    }
  }
}
