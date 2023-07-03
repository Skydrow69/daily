import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Folders } from './models/folders.model';
import { Observable, map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FoldersService {

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

  constructor(private firestore: AngularFirestore) {}

  addFolder(folder: Folders) {
    return this.firestore.collection('projects').add(folder);
  }

  getFoldersFirestore(): Observable<any[]> {
    return this.firestore.collection('projects').snapshotChanges();
  }
  

  getFolders(){
    // return this.firestore.collection('projects').snapshotChanges();
    return this.folders.slice();
  }

  getFolder(id: number) {
    return this.folders[id];
  }

  deleteFolder(folder: Folders):Promise<any> {
   return this.firestore.doc(`projects/${folder.id}`).delete();  
  }

  editFolder(folder: Folders):Promise<any>{
    console.log('id', folder.id);
    return this.firestore.collection('projects').doc(folder.id).update(folder);
  }

}
