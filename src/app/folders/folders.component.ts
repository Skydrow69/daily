import { Component, OnDestroy, OnInit } from '@angular/core';
import { Folders } from '../models/folders.model';
import { FoldersService } from '../folders.service';
import { MenuItem, MessageService, ConfirmationService, ConfirmEventType } from "primeng/api";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class FoldersComponent implements OnInit, OnDestroy {

  show: boolean = false;

  existingLabelError: string = ''; 

  newLabel: string = '' ;

  items!: MenuItem[];

  folder = new Folders(this.newLabel, 'some-id');

  folders: Folders[] = [];

  routeSub?: Subscription;
  routeId?: string;
  id?: string;

  constructor(private foldersService : FoldersService, private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private confirmationService: ConfirmationService ){
  }
  
 


  ngOnInit() {
     this.foldersService.getFoldersFirestore().subscribe((projects) => {
      this.folders = projects.map((e: any) => {
        this.folders = e; // Assigner les données à this.folders
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data(),
        };
      });
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
  addFolder() {

      const existingLabel = this.folders.some(folder => folder.label === this.newLabel);

      if(existingLabel){
        this.existingLabelError = 'Le nom existe déjà !!!';
      }else{
        const newFolder = {
          label: this.newLabel
        };
        console.log('user', newFolder);
        this.foldersService.addFolder(newFolder).then((result) => {
          console.log('add folder firestore', result);
        })
        .catch((error) => {
          console.error('Error adding user to Firestore:', error);
        });

        this.folders.push(newFolder);
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
    
    getContextMenuItems(folder: Folders): MenuItem[] {
      return [
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-trash',
          command: () => this.deleteFolder(folder)
        },
        {
          label:'Edit',
          icon: 'pi pi-fw pi-edit',
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

    ngOnDestroy() {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
    }

}
