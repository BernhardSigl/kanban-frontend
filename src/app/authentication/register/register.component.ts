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

  deactivateFields: boolean = false;
  deactivateBtn: boolean = true;
  wrongCredentials: boolean = false;

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
    try {
      let resp: any = await this.as.loginWithUsernameAndPassword(
        this.username,
        this.password
      );
      localStorage.setItem('token', resp['token']);
      localStorage.setItem('author', resp['user_id']);
      this.router.navigateByUrl('/kanban');
      console.log('resp: ', resp);
    } catch (e) {
      console.warn('Error: ', e);
      this.wrongCredentials = true;
      setTimeout(() => {
        this.wrongCredentials = false;
      }, 3000);
    }
    this.deactivateFields = false;
  }

  disabledBtn(): boolean {
    return this.username === '' || this.password === '' || this.repeatPassword === '' || (this.password.length !== this.repeatPassword.length);
  }
}
