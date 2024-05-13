import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

import { NgbAlertConfig, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbAlertModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [NgbAlertConfig],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

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

  async login() {
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
    return this.username === '' || this.password === '';
  }
}
