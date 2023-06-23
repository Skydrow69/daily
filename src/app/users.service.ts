import { Injectable } from '@angular/core';
import { UsersModel } from './models/users.model';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users = [
    {
      "name": "aliqua",
      "project": [
        0
      ]
    },
    {
      "name": "culpa",
      "project": [
        1
      ]
    },
    {
      "name": "exercitation",
      "project": [
        1
      ]
    },
    {
      "name": "nulla",
      "project": [
        1
      ]
    },
    {
      "name": "veniam",
      "project": [
        2
      ]
    },
    {
      "name": "tempor",
      "project": [
        2
      ]
    },
    {
      "name": "eiusmod",
      "project": [
        2
      ]
    }
  ];


  constructor(private firestore: AngularFirestore) { }

  getUsersProject(id: number){
   const userProject = this.users.filter(user => user.project.includes(id));
   console.log('USERS', userProject);
   return userProject;
  }

  // addUserProject(id: number, user: UsersModel) {
  //   this.users.push(user);
  //   // return this.getUsersProject(user.project[0]);
  //   return this.getUsersProject(id);
  // }

  addUsersProjectFirestore(projectId: string, user: UsersModel){
    // const userObject = {
    //   name: user.name,
    //   project: user.project
    // };
  
    // return this.firestore
    //   .collection('projects')
    //   .doc(projectId)
    //   .collection('users')
    //   .add(userObject);


    return this.firestore.collection('users').add(Object.assign({}, user));
  }

  getUsers(): Observable<any>{
    return this.firestore.collection('users').snapshotChanges();
  }

  getUsersByProjectId(projectId: string): Observable<any>{
    return this.firestore.collection('users').snapshotChanges();
  }

  deleteUser(user: UsersModel):Promise<any>{
    return this.firestore.collection('users').doc(user.id).delete();
  }
  
  
  isExistingUser(usersList: UsersModel[], username: string) {
    return usersList.some(user => user.name === username); 
  }
}
