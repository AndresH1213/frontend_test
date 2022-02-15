import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public register: boolean = false;
  public hasError: boolean = false;
  public classSignIn: string = 'active';
  public classSignUp: string = 'inactive underlineHover';

  public name: string = '';
  public password: string = '';
  public password2: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  createUser(): any {
    if (!this.name || this.name.length < 3) {
      this.hasError = true;
      return Swal.fire(
        'Missing Params',
        'Please provide Username more than 3 letters length',
        'error'
      );
    }

    if (this.password !== this.password2 || this.password.length < 7) {
      return Swal.fire(
        'Password does not match',
        'Passwords should match and have min 6 characters',
        'error'
      );
    }

    const authForm = {
      username: this.name,
      password: this.password,
    };

    this.authService.createUser(authForm).subscribe(
      (resp) => {
        // navigate dashboard
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        Swal.fire('Oops!', err.error.msg, 'error');
      }
    );
  }

  logIn() {
    const authForm = {
      username: this.name,
      password: this.password,
    };

    this.authService.loginUser(authForm).subscribe(
      (resp) => {
        if (resp.token) {
          this.router.navigateByUrl('/dashboard');
        }
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  signInForm() {
    this.register = false;
    this.classSignIn = 'active';
    this.classSignUp = 'inactive underlineHover';
  }

  signUpForm() {
    this.register = true;
    this.classSignUp = 'active';
    this.classSignIn = 'inactive underlineHover';
  }
}
