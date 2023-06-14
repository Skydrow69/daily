import { Injectable } from '@angular/core';

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

  constructor() { }


  getFolders(){
    return this.folders.slice();
  }

  getFolder(id: number) {
    return this.folders[id];
  }

}
