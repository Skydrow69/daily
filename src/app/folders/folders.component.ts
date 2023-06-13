import { Component } from '@angular/core';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss']
})
export class FoldersComponent {

  show: boolean = false;

  newLabel: string = '' ;

  folders = [
    {
      label: 'test'
    },
    {
      label: 'test1'
    },
    {
      label: 'test2'
    },
  ];
//to do : AJOUTER UN MESSAGE D'ERREUR SI LE NOM DU NOUVEAU DOSSIER EXISTE DEJA DANS LE TABLEAU DES DOSSIER

    addFolder() {
      const newFolder = {
        label: this.newLabel
      };
    
      // Ajouter le nouvel objet au tableau "folders"
      this.folders.push(newFolder);

      this.newLabel ='';
    }

}
