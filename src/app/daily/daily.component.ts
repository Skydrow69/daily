import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Folders } from '../models/folders.model';
import { FoldersService } from '../folders.service';

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

  constructor(private route: ActivatedRoute,
              private foldersService: FoldersService){}
  
  ngOnInit() {

    this.route.params.subscribe((params)=> {
      console.log('route param', params['id']);
      this.folder = this.foldersService.getFolder(params['id']);
    })

  }



  addUser(){
    this.users.push(this.username);
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
  }
}
