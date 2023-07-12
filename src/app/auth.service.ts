import { Injectable } from '@angular/core';
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
              private firestore: AngularFirestore) { }
   // Sign up with email/password
   signUp(email: any, password: any) {
    console.log('I M HERE');
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaiton
        Mail() function when new user sign 
      up and returns promise */
         this.sendVerificationMail();
         this.setUserData(result.user);
         console.log('OK', result);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
    // Send email verfificaiton when new user sign up
    sendVerificationMail() {
      return this.afAuth.currentUser
        .then((u) => u?.sendEmailVerification())
        .then(() => {
          this.router.navigate(['/verify-email']);
        });
    }
  
    setUserData(admin: any) {
      const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
        `admin/${admin.uid}`
      );
      const userData: AdminModel= {
        uid: admin.uid,
        email: admin.email,
        displayName: admin.displayName,
        photoURL: admin.photoURL,
        emailVerified: admin.emailVerified,
      };
      return userRef.set(userData, {
        merge: true,
      });
    }
  
}
