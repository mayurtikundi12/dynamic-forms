import { Component, OnInit } from '@angular/core';
import {BackConnectionService} from '../services/back-connection.service'
import {ElementRef,Renderer2} from '@angular/core'
import { FormControl,FormGroup ,FormBuilder, Validators} from '@angular/forms';
import swal from 'sweetalert2'
@Component({
  selector: 'app-formgetter',
  templateUrl: './formgetter.component.html',
  styleUrls: ['./formgetter.component.css']
})
export class FormgetterComponent implements OnInit {
  
  answerObject ={}
  AnsForm

  gotDataFlag:boolean = false ;
  FormData={
    formTitle:"",
    formDescription:"",
    QuestionsArray:[],
  };

  AnswersArray:Array<Object>

  constructor(private formService:BackConnectionService,private element:ElementRef,
    private FB:FormBuilder) { }

  ngOnInit() {
  }
  show(){

  }
  getForm(){
    let formName = this.element.nativeElement.querySelector('#formName')
    formName = formName.value ; 
    if(formName){
      this.formService.getForm(formName).subscribe(data=>{
       if(data.payload.response){       
        this.gotDataFlag = true ;        
        this.FormData = data.payload.response ;
       let   questionArray = this.FormData.QuestionsArray
       let currentQuestion ;
       //creating the formControlName for each answer so that later we can directly access the values
        for (const index in questionArray) {
          currentQuestion =questionArray[index]
          if(currentQuestion['qType']=='checkbox'){
            for (const innerIndex in currentQuestion['subQuestions']) {
              this.answerObject['SANS-'+index+'-'+innerIndex]=['']
            }
          }else{
            this.answerObject['ANS-'+index]=[''] ;   
          }          
        }
        this.AnsForm = this.FB.group(this.answerObject)
        //while getting the form itself we are making an array for the answers
       }else{
        swal({
          type: 'error',
          title: 'Oops...',
          text: 'no such form available',
        })
       }
       
      });
    }
  }

  saveUserForm(){
    let ansElement = this.AnsForm.value
    

    //getting the title and the description and the formId and the questions Array
    this.FormData['formId'] = this.FormData['_id']
    //once we have got the FormID delete the _id field
    delete this.FormData['_id'] ; 
    this.FormData['AnswersArray'] = []

    //creating a flag and a variable to store the checkbox answers
    let checkboxAns = [];
    let lastWasCheckbox:boolean = false ;
    for (const question in ansElement) {
      //checking for the condition if the question has subquestions 
      //specifically for checkbox since there is no other way for it

      if(question.charAt(0)=='A'){
        //this means that the ans is not a checkbox
        //if it is a checkbox check whether it is has value true else put it as false 
        this.FormData['AnswersArray'].push(ansElement[question])

        if(lastWasCheckbox == true){
          this.FormData['AnswersArray'].push(checkboxAns)
          checkboxAns = []
        }
      lastWasCheckbox = false ;

       }else if(question.charAt(0)=='S'){
        // this means that the answer type is a checkbox
         if(ansElement[question]){
          checkboxAns.push(true)
         }else{
          checkboxAns.push(false)
         }
         lastWasCheckbox = true ;

      }
      
    }
    swal({
      position: 'center',
      type: 'success',
      title: 'save success',
      showConfirmButton: false,
      timer: 1500
    })  
    
    //here we can save this form to the database [this.FormData]
    console.log(this.FormData);    
  }
}
