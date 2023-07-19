import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Folders } from '../models/folders.model';
import { FoldersService } from '../folders.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from '../users.service';
import { UsersModel } from '../models/users.model';
import { MessageService, ConfirmationService, ConfirmEventType } from "primeng/api";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DailyComponent implements OnInit, OnDestroy {
  seconds: number =0;
  minutes: number =0;
  timer: any;
  timerInterval: any;
  username!: UsersModel;
  usernameStart: string = '';
  usersChosen: Array<string> = [];
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
  idProject!: string;
  projectId!: string;
  newUser1!: string;
  user!: UsersModel;
  idUserSelected?: string;
  editUsername?: string;
  isPausing: boolean = false;
  speakingTime: number = 5000;
  category = [
    { name: 'product-owner', code: 'PO'},
    { name: 'developer', code: 'DEV'}
  ];

  






  constructor(private route: ActivatedRoute,
              private foldersService: FoldersService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private userService : UsersService){
              }
  
  ngOnInit() {
      this.route.params.subscribe((params)=> {
      console.log('route param', params['id']);  
      this.idProject = params['id'];
      this.userService.getUsersByProjectId(this.idProject).subscribe((users) => {
        this.usersList = users.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          };
        });
        this.usersList = this.usersList.filter((users) => users.project?.includes(this.idProject));
        if(this.usersList.length > 0){
          console.log(this.usersList);
          this.randomizer(this.usersList);
        }
      });
    });

    this.addUsersForm = new FormGroup({
      username: new FormControl(),
      category: new FormControl()
    });

  }

  addUserFirestore() {
    const newUser1 = this.addUsersForm.value.username;
    const newUser = new UsersModel(newUser1, [this.idProject]);
    newUser.category = this.addUsersForm.value.category;
    console.log('user', newUser);

    
    if(this.userService.isExistingUser(this.usersList, newUser1)) {
         console.log(this.addUsersForm.value.username)
         this.usernameError = `${newUser1} existe déjà`;
       }else{
        this.userService.addUsersProjectFirestore(this.idProject, newUser)
        .then((result) => {
          console.log('add users firestore', result);
        })
        .catch((error) => {
          console.error('Error adding user to Firestore:', error);
        });
        this.usernameError = '';
      }
      this.addUsersForm.reset();
  }

    deleteUser(user: UsersModel){
      console.log('userlist', user);
      this.confirm2(user);
    }

    editUser(user :UsersModel){
      const editName = {
        name: this.editUsername || '',
        id: user.id,
        project: user.project
      }

      this.userService.editUser(editName).then(result => {
        console.log('nom modifié', user);
      }).catch((error) => {
        console.error('Error editing user to Firestore:', error);
     });

     this.idUserSelected = '';
     this.editUsername = '';

    }

    isEditUsername(user: UsersModel) {
      if(this.idUserSelected === user.id) {
        return true;
      }
      return false;
    }
    

    isCurrentUserSpeaking(user: UsersModel) {
      return this.stateDaily === 'process' && user && user.name === this.user.name;    
    }


  startRandomizingUser(timeInterval: number) { 
    this.stateDaily = 'process';
    this.timerInterval = setInterval(() => {
      console.log('next');
      const remainingUsers = this.usersList.filter(user => { 
        console.log('randomising usersChosen', this.usersChosen);
        console.log('randomising user', user.name);
        return !this.usersChosen.includes(user.name);
      });
      // console.log('REMAINING USERS: ', remainingUsers);
      if (remainingUsers.length > 0) {
       this.randomizer(remainingUsers);
      } else {
        this.stopTimer();
      }   
    }, timeInterval);
  }

  getColorByCategory(label: string | undefined){
    switch (label) {
      case 'product-owner':
        return {'background-color': '#9c27b0', color: 'white!important' };
        break;
      case 'developer':
        return {'background-color': 'red', color: 'white!important' }
        break;
      default:
       return {};
    }
  }

  randomizer(remainingUsers: UsersModel[]) {

    const randomIndex = Math.floor(Math.random() * remainingUsers.length);
    this.user = remainingUsers[randomIndex];
    // console.log('remainingUsers', remainingUsers);
    this.usersChosen.push(this.user.name);
  }

  nextUser() {
    clearInterval(this.timerInterval);
    const remainingUsers = this.usersList.filter(user => !this.usersChosen.includes(user.name));
    if (remainingUsers.length > 0) {
      this.randomizer(remainingUsers);
      this.startRandomizingUser(this.speakingTime);
     } else {
       this.stopTimer();
     }  
  }
  
  formatTimer(time: number): any {
    if(time < 10){
      return '0' + time;
    }
    return time;
  }

  startTimer() { 
    if (this.stateDaily === 'init') {
      this.seconds = 1;
    }
    
    this.startRandomizingUser(this.speakingTime);
    this.timer = setInterval(() => {
      if (!this.isPausing) {
        this.seconds++;
  
        if (this.seconds === 60) {
          this.minutes++;
          this.seconds = 0;
        }
      }
    }, 1000);
  }
  
  stopTimer() {
    clearInterval(this.timer);
    clearInterval(this.timerInterval);
    this.stateDaily = 'end';
    // console.log(this.usersChosen);
    // console.log(this.usersList);
  }
  resumeTimer() {
    this.isPausing = false;
    this.startRandomizingUser(this.speakingTime);
    console.log(this.usersChosen);
    console.log(this.usersList);

  }
  
  pauseTimer() {
    this.isPausing = true;
    clearInterval(this.timerInterval);
    this.speakingTime = this.seconds > 5 ? ((this.seconds*1000) % this.speakingTime) : this.speakingTime - this.seconds*1000;
    // Arrêter le tirage au sort si nécessaire
    // ...
    console.log('pause chosen', this.usersChosen);
    console.log('pause list', this.usersList);
    console.log('speakingtime', this.speakingTime);

  }
  
  
  
  resetTimer() {
    this.randomizer(this.usersList);
    console.log('userchosen reset', this.usersChosen);
    console.log('usersList reset', this.usersList);
    this.minutes = 0;
    this.seconds = 0;
    this.stopTimer();
    this.stateDaily = 'init';
    this.usersChosen = [];
  }
  

  confirm2(user: UsersModel) {
    this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.userService.deleteUser(user).then( result => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
          });        
        },
          reject: (type: any) => {
            switch (type) {
              case ConfirmEventType.REJECT:
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                break;
              case ConfirmEventType.CANCEL:
                this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                break;
              default:
                this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                break;
            }
          }
          
    });
}

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.stopTimer();
    console.log('STOOOP', this.stopTimer);

  }
}
