import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Folders } from '../models/folders.model';
import { FoldersService } from '../folders.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from '../users.service';
import { UsersModel } from '../models/users.model';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit, OnDestroy {
  seconds: number =0;
  minutes: number =0;
  timer: any;
  timerInterval: any;
  username: string = '';
  usernameStart: string = '';
  usersChosen : Array<string> = [];
  users: Array<string> = ['user1', 'user2', 'user3'];
  index!: number ;
  startUserIndex: number = -1;
  stateDaily: string = 'init';
  folder?: Folders;
  addUsersForm!: FormGroup;
  usernameError?: string;
  newUser = {
    name: '',
    project: []
  };
  usersList!: UsersModel[];
  idProject!: number;





  constructor(private route: ActivatedRoute,
              private foldersService: FoldersService,
              private userService : UsersService){
              }
  
  ngOnInit() {
  
    this.route.params.subscribe((params)=> {
      console.log('route param', params['id']);
      this.idProject = +params['id'];
      this.usersList = this.userService.getUsersProject(this.idProject);
      this.folder = this.foldersService.getFolder(this.idProject);
    });

    this.addUsersForm = new FormGroup({
      username: new FormControl(),
    });

  }



  addUser(){

      const newUsername = this.addUsersForm.value.username;
      const newUser = new UsersModel(newUsername, [this.idProject]);
      console.log('UTILISATEUR EXISTANT', this.userService.isExistingUser(newUser));
      if(this.userService.isExistingUser(newUser)){
        console.log(this.addUsersForm.value.username)
        this.usernameError = `${newUsername} existe déjà`;
      }else{
        this.usersList = this.userService.addUserProject(this.idProject, newUser);
        console.log('USERS ADDED', this.userService.users);
        this.usernameError = '';
      }
      this.addUsersForm.reset();
    //   for(let i = 0; i < this.users.length; i++){
    //     if(this.users[i] === this.addUsersForm.value.username){
    //       this.usernameError = 'Le nom existe déjà';
    //       return;
    //     }
    // }
    // this.users.push(this.addUsersForm.value.username);
    // console.log('USERS ADDED', this.users);
    // this.usernameError = '';
  }

  startRandomizingUser(timeInterval: number) { 
    this.stateDaily = 'process';
    this.randomizer(this.users);
    this.timer = setInterval(() => {
      const remainingUsers = this.users.filter(user => !this.usersChosen.includes(user));
      console.log('REMAINING USERS: ', remainingUsers);
      if (remainingUsers.length > 0) {
       this.randomizer(remainingUsers);
      } else {
        this.stopTimer();
      }   
    }, timeInterval);
  }

  randomizer(remainingUsers: Array<string>) {

    const randomIndex = Math.floor(Math.random() * remainingUsers.length);
    console.log(remainingUsers);
        this.username = remainingUsers[randomIndex];
        this.usersChosen.push(this.username);
        console.log('username: ', this.username);
    
  }
  
  formatTimer(time: number): any {
    if(time < 10){
      return '0' + time;
    }
    return time;
  }

  startTimer() {
    
    if(this.stateDaily === 'init'){
      this.seconds = 1;
    }
    this.startRandomizingUser(5000);
    // this.draw();
    // this.setIntervalDraw();
    this.timer = setInterval(() => {
      this.seconds++;
  
      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
      }
    }, 1000);
  }

  stopTimer(){
    clearInterval(this.timer);
    clearInterval(this.timerInterval);
    this.stateDaily = 'end';
  }
  
  resetTimer(){
    this.minutes =0;
    this.seconds =0;
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.stopTimer();
    console.log('STOOOP', this.stopTimer);

  }
}
