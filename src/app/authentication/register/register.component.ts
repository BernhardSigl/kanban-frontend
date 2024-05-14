import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgbAlertConfig, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgbAlertModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  repeatPassword: string = '';
  email: string = '';
  wrongEmailText: string = `Email isn't valid.`;
  wrongPasswordText: string = `Passwords don't match.`;

  deactivateFields: boolean = false;
  deactivateBtn: boolean = true;
  wrongEmailBoolean: boolean = false;
  wrongPasswordBoolean: boolean = false;

  constructor(
    private as: AuthService,
    private router: Router,
    alertConfig: NgbAlertConfig
  ) {
    alertConfig.type = 'danger';
    alertConfig.dismissible = false;
  }

  async register() {
    this.deactivateFields = true;
    const valid = await this.checkCredentials();
    if (valid) {
      try {
        console.log(this.email);
        let resp: any = await this.as.registerUser(
          this.username,
          this.email,
          this.password
        );
        localStorage.setItem('token', resp['token']);
        localStorage.setItem('author', resp['user_id']);
        this.router.navigateByUrl('/kanban');
        console.log('resp: ', resp);
      } catch (e) {
        console.warn('Error: ', e);
      }
      this.deactivateFields = false;
    }
  }

  disabledBtn(): boolean {
    return (
      this.username === '' ||
      this.password === '' ||
      this.repeatPassword === '' ||
      this.password.length !== this.repeatPassword.length
    );
  }

  showAlert(alertMsg: string) {
    this.deactivateFields = false;
    if (alertMsg === 'password') {
      this.wrongPasswordBoolean = true;
      setTimeout(() => {
        this.wrongPasswordBoolean = false;
      }, 3000);
    } else if (alertMsg === 'email') {
      this.wrongEmailBoolean = true;
      setTimeout(() => {
        this.wrongEmailBoolean = false;
      }, 3000);
    }
  }

  async checkCredentials(): Promise<boolean> {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;
    if (this.password !== this.repeatPassword) {
      this.password = '';
      this.repeatPassword = '';
      this.showAlert('password');
      valid = false;
    }
    if (!emailPattern.test(this.email) && this.email !== '') {
      this.showAlert('email');
      valid = false;
    }
    return valid;
  }
}
