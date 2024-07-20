import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/service/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  err: string = '';
  load: boolean = false;
  LoginGroup: FormGroup;

  constructor(private _AuthService: AuthService, private _Router: Router) {
    this.LoginGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_@]{6,}$/),
      ]),
    });
  }

  handle(): void {
    this.load = true;
    const userData = this.LoginGroup.value;
    if (this.LoginGroup.valid) {
      this._AuthService.login(userData).subscribe({
        next: (response) => {
          if (response.msg === 'done') {
            console.log(response);
            localStorage.setItem('token', '3b8ny__' + response.token);
            this._Router.navigate(['/home']);
          } else {
            this.handleErrorResponse(response);
          }
          this.load = false;
        },
        error: (err) => {
          this.load = false;
          this.err = err.error.msg || 'An error occurred. Please try again.';
        },
      });
    } else {
      this.load = false;
      this.err = 'Please fill out the form correctly.';
    }
  }

  private handleErrorResponse(response: any): void {
    this.err = response.msg || 'An error occurred. Please try again.';
  }
}
