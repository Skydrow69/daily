import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DailyComponent } from './daily/daily.component';
import { FoldersComponent } from './folders/folders.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreModule } from '@angular/fire/firestore';
import { environment } from 'environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DeleteFolderDialComponent } from './modals/delete-folder-dial/delete-folder-dial.component';
import {MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { SignupComponent } from './signup/signup.component';
import { PasswordModule } from 'primeng/password';
import { VerifyEmailComponent } from './verify-email/verify-email.component';




@NgModule({
  declarations: [
    AppComponent,
    DailyComponent,
    FoldersComponent,
    HomeComponent,
    DeleteFolderDialComponent,
    SignupComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ContextMenuModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    ToastModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    HttpClientModule,
    InputTextModule,
    MessagesModule,
    AvatarModule,
    DropdownModule,
    PasswordModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
