import { Injectable } from '@angular/core';
import { UsersModel } from './models/users.model';

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


  constructor() { }

  getUsersProject(id: number){
   const userProject = this.users.filter(user => user.project.includes(id));
   console.log('USERS', userProject);
   return userProject;
  }

  addUserProject(id: number, user: UsersModel) {
    this.users.push(user);
    // return this.getUsersProject(user.project[0]);
    return this.getUsersProject(id);
  }

  isExistingUser(userForm: UsersModel) {
    const usersList = this.getUsersProject(userForm.project[0])
    return usersList.some(user => user.name === userForm.name); 
  }
}
