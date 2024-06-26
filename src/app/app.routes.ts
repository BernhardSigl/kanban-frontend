import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { KanbanComponent } from './landing_page/kanban/kanban.component';
import { RegisterComponent } from './authentication/register/register.component';

export const routes: Routes = [
    {path: '', redirectTo:'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'kanban', component: KanbanComponent},
];
