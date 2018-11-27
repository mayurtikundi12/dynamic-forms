import { Injectable } from '@angular/core';
import {ConfigService} from '../config/config.service' ;
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class BackConnectionService {

  
  constructor(private http:HttpClient,private CONFIG:ConfigService) { }

  setForm(formData){
    return this.http.post<any>('http://localhost:3000/form/set',formData)
  }

  getForm(formName){
    return this.http.get<any>('http://localhost:3000/form/get/'+formName)
  }
}
