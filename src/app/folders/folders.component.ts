import { Component, OnDestroy, OnInit } from '@angular/core';
import { Folders } from '../models/folders.model';
import { FoldersService } from '../folders.service';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent implements OnInit, OnDestroy {

  show: boolean = false;

  existingLabelError: string = ''; 

  newLabel: string = '' ;


  constructor(private foldersService : FoldersService){
    
  }
  

  folders: Folders[] = [];

  ngOnInit() {
    this.folders = this.foldersService.getFolders();
    this.foldersService.getFoldersFirestore().subscribe((projects) => {
      this.folders = projects.map((e: any) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data(),
        };
      });
    });
  }
    addFolder() {

      const existingLabel = this.folders.some(folder => folder.label === this.newLabel);

      if(existingLabel){
        this.existingLabelError = 'Le nom existe déjà !!!';
      }else{
        const newFolder = {
          label: this.newLabel
        };
        this.foldersService.addFolder(newFolder);
        this.folders.push(newFolder);
        this.newLabel ='';
        this.existingLabelError = '';
      }
       // Ajouter le nouvel objet au tableau "folders"
    }

    ngOnDestroy() {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
    }

}
