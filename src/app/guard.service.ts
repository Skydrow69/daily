import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(public auth: AuthService, public router: Router, private angularFireAuth: AngularFireAuth) { }

  canActivate(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(map((user)=>{
      if(this.auth.isLoggedIn !== true) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }))
  }

}
