import { Component } from '@angular/core';
import {  MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-delete-folder-dial',
  templateUrl: './delete-folder-dial.component.html',
  styleUrls: ['./delete-folder-dial.component.scss']
})
export class DeleteFolderDialComponent {

  public confirmMessage?: string;
  
  constructor(public dialogRef: MatDialogRef<DeleteFolderDialComponent>){}

}
