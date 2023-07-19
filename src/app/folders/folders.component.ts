import { Component, OnDestroy, OnInit } from '@angular/core';
import { Folders } from '../models/folders.model';
import { FoldersService } from '../folders.service';
import { MenuItem, MessageService, ConfirmationService, ConfirmEventType, Message } from "primeng/api";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'app/auth.service';
import { UsersModel } from 'app/models/users.model';
import { UsersService } from 'app/users.service';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class FoldersComponent implements OnInit, OnDestroy {
  
  show: boolean = false;
  
  existingLabelError: string = ''; 
  
  messages: Message[] = [];
  
  newLabel: string = '' ;
  
  editLabel: string = '';
  
  items!: MenuItem[];
  
  folder = new Folders(this.newLabel, 'some-id');
  
  folders: Folders[] = [];
  
  routeSub?: Subscription;
  routeId?: string;
  id?: string;
  editMode: boolean = false;
  idFolderSelected?: string;
  scrumMaster?: any;
  idProject?: string;
  usersList!: UsersModel[];


  
  constructor(private foldersService : FoldersService, private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private userService: UsersService){
    }
    
    
    
    
    ngOnInit() {
      this.scrumMaster = this.authService.getAdminUser();
      this.userService.getUserById(this.scrumMaster.uid).subscribe((data: any) => {
        const userId = data.payload.id;
        this.scrumMaster = data.payload.data();

        console.log('User ID:', userId);
        console.log('User Data:', this.scrumMaster);
      });
      //this.userService.setUserById();
      this.userService.getUsers().subscribe((users) => {
        this.usersList = users.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          };
        });  
      });
      this.foldersService.getFoldersFirestore().subscribe((projects) => {
        this.folders = projects.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          };
        });
        this.folders = this.folders.filter((project) => project.adminId?.includes(this.scrumMaster.id));
        if(this.folders.length > 0){
          console.log(this.folders);
        }
      });
      this.items = [
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-trash',
          command: (event: any) => {this.deleteFolder(event.item.id)}     
        },
        {
          label: 'Edit',
          icon: 'pi pi-fw pi-edit'
        }
      ];
    }
    async addFolder() {
      const existingLabel = this.folders.some(folder => folder.label === this.newLabel);
      if(existingLabel){
        this.existingLabelError = 'Le nom existe déjà !!!';
      }else{
        const id = this.scrumMaster.id;
        const newFolder = {
          label: this.newLabel,
          adminId: id   
        };
        try {
          const result = await this.foldersService.addFolder(newFolder);
          console.log('add folder firestore', result.id);
          this.idProject = result.id;
        
          const editUser = { 
            name: this.scrumMaster.name,
            project: [...this.scrumMaster.project, this.idProject]
          };
          console.log('edit', editUser);
          const editedResult = await this.userService.setUserById(this.scrumMaster.id, editUser);
          console.log('nom modifié', editedResult);
        } catch (error) {
          console.error('Error:', error);
        }
        this.newLabel ='';
        this.existingLabelError = '';
      }
      // Ajouter le nouvel objet au tableau "folders"
    }
    
    deleteFolder(folder: Folders) {
      // Ici, vous pouvez utiliser l'ID du dossier pour effectuer l'opération de suppression
      this.confirm2(folder);
      console.log('Folder ID to delete:', folder);
    }
    
    editFolder(folder: Folders) {
      this.idFolderSelected = folder.id;
    }
    
    editFolderSubmit(folder: Folders) {
      // this.foldersService.editFolder(folder).then(() => {
      // })
      const existingLabel = this.folders.some(folder => folder.label === this.editLabel);
      
      if(existingLabel){
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Le nom existe déjà' }];
      }else{
        const editFolder = {
          label: this.editLabel,
          id: folder.id
        };
        console.log('folder edited', editFolder);
        this.foldersService.editFolder(editFolder).then((result) => {
          
          console.log('edit folder firestore', result);
        })
        .catch((error) => {
          console.error('Error adding user to Firestore:', error);
        });
        this.idFolderSelected = '';
        this.editLabel ='';
        this.existingLabelError = '';
      }
    }
    
    editFolderName(folder: Folders) {
      if(this.idFolderSelected === folder.id) {
        return true;
      }
      return false;
    }
    
    getContextMenuItems(folder: Folders): MenuItem[] {
      return [
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-trash',
          command: () => this.deleteFolder(folder)
        },
        {
          label:'Edit',
          icon: 'pi pi-fw pi-pencil',
          command: () => this.editFolder(folder)
        }
      ];
    }
    
    confirm2(folder: Folders) {
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.foldersService.deleteFolder(folder).then( result => {
            
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
    
    signOut(){
      this.authService.signOut()
    }
    
    ngOnDestroy() {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
    }
  }
  