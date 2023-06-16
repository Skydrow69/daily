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
//to do : AJOUTER UN MESSAGE D'ERREUR SI LE NOM DU NOUVEAU DOSSIER EXISTE DEJA DANS LE TABLEAU DES DOSSIER

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.folders = this.foldersService.getFolders();
  }
    addFolder() {
      
      const existingLabel = this.folders.some(folder => folder.label === this.newLabel);

      if(existingLabel){
        this.existingLabelError = 'Le nom existe déjà !!!';
      }else{
        const newFolder = {
          label: this.newLabel
        };
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
