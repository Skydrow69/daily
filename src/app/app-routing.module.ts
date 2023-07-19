import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DailyComponent } from './daily/daily.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FoldersComponent } from './folders/folders.component';
import { GuardService } from './guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'interface', component: FoldersComponent, 
    canActivate: [GuardService]
  },
  {
    path: 'daily/:id',
    component: DailyComponent,
    canActivate: [GuardService],
  },
  
  { path:'sign-up', component: SignupComponent },
  { path: 'verify-email', component: VerifyEmailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
