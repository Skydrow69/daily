import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UsersModel } from './models/users.model';
import { AdminModel } from './models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private firestore: AngularFirestore
              ) { 
                 this.afAuth.authState.subscribe((user) => {
                   if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    console.log('user', user);
                   } else {
                    localStorage.setItem('user', '');
                   }
                 });
              }

  signIn(user: any) {
    return this.afAuth
    .signInWithEmailAndPassword(user.email, user.password)
    .then((result) => {
      this.router.navigate(['/interface']);
      console.log('res', result);
      })
      .catch((error) => {
        window.alert(error.message);
    });
  }            
   // Sign up with email/password
   signUp(user: any) {
    console.log('I M HERE');
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        /* Call the SendVerificaiton
        Mail() function when new user sign 
      up and returns promise */
         this.sendVerificationMail();
         this.setUserData(result.user?.uid, user);
         console.log('OK', result);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  signOut(){
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion après la déconnexion
      localStorage.removeItem('user');
    });
  }

  get isLoggedIn(): boolean {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        return Object.keys(user).length !== 0 && user.emailVerified !== false;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return false;
      }
    } else {
      return false;
    }
  }
  

  
    // Send email verfificaiton when new user sign up
    sendVerificationMail() {
      return this.afAuth.currentUser
        .then((u) => u?.sendEmailVerification())
        .then(() => {
          this.router.navigate(['/verify-email']);
        });
    }
  
    setUserData(id: any, admin: any) {
      if(id){
        const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
          `users/${id}`
        );
        
        const userData: UsersModel= {
          id: id,
          name: admin.username,
          category: 'scrum-master',
          project: [],
        };
        return userRef.set(userData, {
          merge: true,
        });
      }
      return false;
    }

    getAdminUser(){
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          return user;
        } catch (error) {
          console.error('Error parsing user data:', error);
          return false;
        }
      } else {
        return false;
      }
    }
}
