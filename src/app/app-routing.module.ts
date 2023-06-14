import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DailyComponent } from './daily/daily.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'daily', component: DailyComponent},
  {path:'daily/:id', component: DailyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
