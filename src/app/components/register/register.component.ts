import { AuthService } from './../../core/service/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerGroup: FormGroup;
  err: string = '';
  load: boolean = false;

  constructor(private _AuthService: AuthService, private _Router: Router) {
    this.registerGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_@]{6,}$/),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
      age: new FormControl('', [Validators.required]),
    });
  }

  handle(): void {
    this.load = true;
    const userData = this.registerGroup.value;
    if (this.registerGroup.valid) {
      this._AuthService.register(userData).subscribe({
        next: (response) => {
          if (response.msg === 'done') {
            console.log(response);
            this._Router.navigate(['/login']);
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
