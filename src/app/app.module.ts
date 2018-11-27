import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsetterComponent } from './formsetter/formsetter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  ReactiveFormsModule } from '@angular/forms'
import { RoutingModule } from './routing/routing.module';
import {MatRadioModule,MatButtonModule,MatIconModule,MatCardModule,MatInputModule, MatCheckboxModule, MatSelectModule} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import { FormgetterComponent } from './formgetter/formgetter.component';
import { FormEditorComponent } from './form-editor/form-editor.component'

@NgModule({
  declarations: [
    AppComponent,
    FormsetterComponent,
    FormgetterComponent,
    FormEditorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule ,
    MatIconModule,
    MatRadioModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
