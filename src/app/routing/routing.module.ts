import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes , RouterModule, RoutesRecognized } from '@angular/router'
import { FormsetterComponent } from '../formsetter/formsetter.component';
import { FormgetterComponent } from '../formgetter/formgetter.component';
import { FormEditorComponent } from '../form-editor/form-editor.component';
const routes:Routes = [
  {path:"formsetter", component:FormsetterComponent},
  {path:"formgetter", component:FormgetterComponent},
  {path:"formeditor", component:FormEditorComponent}
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forRoot(routes)
  ] , 
  exports:[RouterModule]
})
export class RoutingModule { }
