import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit {
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
  stateDaily: string = 'init'

  
  ngOnInit() {

  }
  
  // draw(){
  //   this.index = Math.floor(Math.random() * this.users.length);
  //   if(this.usersChosen.includes(this.users[this.index])){
  //     console.log('utilisateur déjà choisi');
  //     if(this.usersChosen.length === this.users.length){
  //       this.stopTimer();  
  //       this.usersChosen = [];
  //       return;
  //     }
  //     this.draw();
  //     return;
  //   }
  //   this.usersChosen.push(this.users[this.index]);
  //   this.username = this.users[this.index];
  //   console.log('utilisateur choisi', this.usersChosen);
  // }
  draw() {
    console.log(this.stateDaily);
    this.index = Math.floor(Math.random() * this.users.length);
    this.stateDaily = 'process';
    if (this.usersChosen.includes(this.users[this.index])) {
      console.log('Utilisateur déjà choisi');
      if (this.usersChosen.length === this.users.length) {
        this.stopTimer();
        this.usersChosen = [];
        return;
      }
      this.draw();
      return;
    }
    this.usersChosen.push(this.users[this.index]);
    this.username = this.users[this.index];
    console.log('Utilisateur choisi', this.usersChosen);
  }
  

  formatTimer(time: number): any {
    if(time < 10){
      return '0' + time;
    }
    return time;
  }

  startTimer(){
    if(this.stateDaily === 'init'){
      this.seconds = 1;
    }
    this.draw();
    this.setIntervalDraw();
    this.timer = setInterval(() => {
      this.seconds++;
  
      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
      }
    }, 1000);
  }

    // }
  // startTimer() {
  //   if (this.startUserIndex === -1) {
  //     const remainingUsers = this.users.filter((user, index) => !this.usersChosen.includes(user));
  //     this.startUserIndex = Math.floor(Math.random() * remainingUsers.length);
  //     const startIndex = this.users.indexOf(remainingUsers[this.startUserIndex]);
  //     this.startUserIndex = startIndex;
  //     this.usersChosen.push(remainingUsers[this.startUserIndex]);
  //   } else {
  //     this.startUserIndex++;
  //     if (this.startUserIndex >= this.users.length) {
  //       this.startUserIndex = 0;
  //     }
  //   }
  
  
  
  
  setIntervalDraw(){
    
    this.timerInterval = setInterval(() => {
      this.draw();
      console.log('change user');
    }, 5000);
    
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
}
