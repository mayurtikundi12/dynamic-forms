import { Component, OnInit } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { BackConnectionService } from '../services/back-connection.service'
import swal from 'sweetalert2'
import { FormControl, FormGroup } from '@angular/forms'
import {Router} from '@angular/router'
import {NotifierService} from 'angular-notifier'

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.css']
})
export class FormEditorComponent implements OnInit {

  constructor(private notifier:NotifierService, private renderer: Renderer2,
     private element: ElementRef,private router:Router,
     private formService: BackConnectionService) { }

  oldFormInfo = new FormGroup({
    formTitle: new FormControl('new form'),
    fromDescription: new FormControl('')
  })

  newFormInfo = new FormGroup({

  })

  oldFormData = []

  gotDataFlag: boolean = false;
  FormData: Object = {}
  ngOnInit() {
  }

  // get form method   gets the forms from the backend 
  getForm() {
    let formName = this.element.nativeElement.querySelector('#formName')
    formName = formName.value;

    if (formName) {
      this.formService.getForm(formName).subscribe(data => {
        console.log('this is the data', data);

        if (data.payload.response != null) {
          this.gotDataFlag = true;
          this.FormData = data.payload.response;
          this.finalFormData.formId = this.FormData['_id']
          //setting the questions array 
          let oldQuestionArray = this.FormData['QuestionsArray'];
          this.oldQuestionCount = oldQuestionArray.length ;
          //filling up the questions array with that of what we get from the backend
          // this.QuestionsArray = this.FormData['QuestionsArray'];
          for (let ref of data.payload.response.QuestionsArray) {
            this.QuestionsArray.push(ref);
          }

          this.oldFormData = oldQuestionArray
          let questionCountText = oldQuestionArray[oldQuestionArray.length - 1]['qNumber']
          this.questionCount = Number(questionCountText.substr(5, questionCountText.length)) + 1

          let question;
          let quesType;
          //for questions having subQues updating the subQuestoins object
          for (const index in this.FormData['QuestionsArray']) {

            //getting the question number and pushing it to the questionNumberText 
            let questionNumText = this.FormData['QuestionsArray'][index]['qNumber']
             questionNumText = Number(questionNumText.substr(5,questionNumText.length)) ;
            //creating a question field field and putting the value for it 
            this.FormData['QuestionsArray'][index]['queNum'] = questionNumText ;
            
            
            //checking for the question type
            question = this.FormData['QuestionsArray'][index]
            quesType = question['qType']
            if (quesType == 'checkbox' || quesType == 'dropdown' || quesType == 'multipleChoice') {
              this.totalSubQuestionCount[questionNumText] = question['subQuestions'].length ;
              this.subQuestions[questionNumText] = question['subQuestions'].length ;
            }
          }
        } else {
          swal({
            type: 'error',
            text: 'Form not found'
          })
        }
      });
    }
  }

  questionCount: number = 1;
  questionInput = '';
  QuestionsArray = [];
  totalSubQuestionCount = {};
  oldQuestionCount:number;

  finalFormData = {
    formTitle: '',
    formDescription: '',
    QuestionsArray: this.QuestionsArray,
    formId:''
  }

  subQuestions: Object = {};


  setQuestionId(element) {
    let count = this.questionCount;

    //first creating the question object in the QuestionArray so that we can save that array to db
    let questionObj = {
      qNumber: 'QDiv-' + count,
      qType: '',
      question: '',
      required:'',
      subQuestions: []
    }
    //pushing the question object in the QuestionsArray
    this.QuestionsArray.push(questionObj)
    this.renderer.setAttribute(element, 'id', 'QDiv-' + count);
  }

  addQuestion() {

    //getting the main component form
    let MainForm = this.element.nativeElement.querySelector('#Qform');

    //creating the Question div element
    let QuestionDiv = this.createElementAndAddClass('div',['question','card']) ;
    
    //setting the id for the main question divion
    this.renderer.setAttribute(QuestionDiv, 'id', 'Q-' + this.questionCount)
    //creating the delete btn for deleting the question div
    let extrasDiv = this.createElementAndAddClass('div',['extrasDiv']);
    let deletebtnIcon = this.createElementAndAddClass('mat-icon', ['material-icons', 'deleteIcon']);
    let deletebtnText = this.renderer.createText('delete');
    this.renderer.setAttribute(deletebtnIcon, 'id', 'delQ-' + this.questionCount)
    this.renderer.appendChild(deletebtnIcon, deletebtnText);
    this.renderer.appendChild(extrasDiv, deletebtnIcon);

//creating the required toggle button functionality
let checkBoxDiv = this.createElementAndAddClass('div',['pretty','p-switch']);
let checkBoxInp = this.createElementAndAddClass('input',[]);
this.renderer.setProperty(checkBoxInp,'type','checkbox');
this.renderer.setProperty(checkBoxInp,'id','Req-'+this.questionCount)
this.renderer.appendChild(checkBoxDiv,checkBoxInp);
let innerCheckBoxDiv = this.createElementAndAddClass('div',['state','p-primary']) 
let checkBoxLabel = this.createElementAndAddClass('label',[])
let labelText = this.renderer.createText('Required');
this.renderer.appendChild(checkBoxLabel,labelText)
this.renderer.appendChild(innerCheckBoxDiv,checkBoxLabel);
this.renderer.appendChild(checkBoxDiv,innerCheckBoxDiv)
let verticalSeparator = this.createElementAndAddClass('div',['verticalSeparator'])
this.renderer.appendChild(extrasDiv,verticalSeparator);        
this.renderer.appendChild(extrasDiv,checkBoxDiv)

this.renderer.appendChild(QuestionDiv,extrasDiv) ; 


    //deleting the question div functionality
    this.renderer.listen(deletebtnIcon, 'click', event => {
      this.renderer.removeChild(MainForm, QuestionDiv);
      // console.log(event.target.id);
      let questionNumberString = event.target.id;
      let quetionNumer = questionNumberString.substring(5, questionNumberString.length)

      for (const index in this.QuestionsArray) {
        let qnumberText = this.QuestionsArray[index]['qNumber'];
        let qnumber = qnumberText.substring(5, qnumberText.length);

        if (qnumber == quetionNumer) {
          //delete it from the array
          let indexNumber = Number(index);
          qnumber = Number(qnumber);
          this.QuestionsArray.splice(indexNumber, 1);
          break;
        }
      }
    })

    //creating the question field
    let formField =  this.createElementAndAddClass('mat-form-field',[])
    let questionInput = this.createElementAndAddClass('input',['formFields','mat-input-element','mat-form-field-autofill-control','cdk-text-field-autofill-monitored'])
    let questionLabel = this.createElementAndAddClass('p',['card-title','question-text'])
    let questionLabelText = this.renderer.createText('Question ');
    let errorPara =  this.createError(`ERROR-${this.questionCount}`,"please fill this field")
    this.renderer.appendChild(questionLabel,questionLabelText)
    this.renderer.appendChild(questionLabel,errorPara)
    this.renderer.setAttribute(questionInput,'placeholder','write your question here')
    this.setQuestionId(questionInput) 
    


    // creating the dropdown for selecting the type of question
    let dropdownformField = this.createElementAndAddClass('mat-form-field',['dropdown-div','mat-form-field-wrapper','mat-form-field-flex','mat-form-field-infix']) ;
    let dropdownError = this.createError(`DROPERROR-${this.questionCount}`,"please choose the question type")
    this.renderer.appendChild(dropdownformField,dropdownError)
    let dropDownText = this.renderer.createText('choose the question type')
    this.renderer.appendChild(dropdownformField,dropDownText)

    let dropdownSelect= this.createElementAndAddClass('select',[]) ;
    this.renderer.setAttribute(dropdownSelect,'id','dropSelect-'+this.questionCount)
  
    //listening to the click event on the dropdown to create respective ans elements  
    this.renderer.listen(dropdownSelect, 'click', event => {
      let questionNumberText = event.target.id;
      let questionNumber = questionNumberText.substring(11, questionNumberText.length)
      for (const index in this.QuestionsArray) {
        let qnumberText = this.QuestionsArray[index]['qNumber'];
        let qnumber = qnumberText.substring(5, qnumberText.length);

        if (qnumber == questionNumber) {
          this.QuestionsArray[index]["qType"] = event.target.value;
          break;
        }
      }
      this.changeAnsType(event.target.value, QuestionDiv)
    })


    //creating short answer type question
    let ShortAnswer = this.createDropdownOptions('Short Answer', 'shortAnswer')


    //creating long answer type question
    let LongAnswer = this.createDropdownOptions('Long Answer', 'longAnswer')

    //creating multiple choice answer type question
    let MultipleChoice = this.createDropdownOptions('Multiple Choice', 'multipleChoice')

    //creating short answer type question
    let QDate = this.createDropdownOptions('Date', 'date')


    //creating time answer type question
    let Time = this.createDropdownOptions('Time', 'time')

    //creating check box answer type question
    let CheckBox = this.createDropdownOptions('Check Box', 'checkbox')

    //creating short answer type question
    let DropDown = this.createDropdownOptions('Dropdown', 'dropdown')

    //creating short answer type question
    let UploadFile = this.createDropdownOptions('Upload File', 'uploadFile')


    //appending all the elements to select
    this.renderer.appendChild(dropdownSelect, ShortAnswer)
    this.renderer.appendChild(dropdownSelect, LongAnswer)
    this.renderer.appendChild(dropdownSelect, MultipleChoice)
    this.renderer.appendChild(dropdownSelect, QDate)
    this.renderer.appendChild(dropdownSelect, Time)
    this.renderer.appendChild(dropdownSelect, CheckBox)
    this.renderer.appendChild(dropdownSelect, DropDown)
    this.renderer.appendChild(dropdownSelect, UploadFile)

    //appending  the select element to the form
    this.renderer.appendChild(dropdownformField, dropdownSelect)


    //appending all the elements to the form element
    this.renderer.appendChild(formField, questionLabel)
    this.renderer.appendChild(formField, questionInput)
    this.renderer.appendChild(QuestionDiv, formField)
    this.renderer.appendChild(QuestionDiv, dropdownformField)
    this.renderer.appendChild(MainForm, QuestionDiv)


    //changing the question count
    this.questionCount++;
  }


  changeAnsType(queType, ParentElement) {
    // using switch statement to create different types of answers for respective questions
    switch (queType) {

      case "shortAnswer": this.createAnsType(ParentElement, "shortAnswer")
        break;
      case "longAnswer": this.createAnsType(ParentElement, "longAnswer")
        break;
      case "multipleChoice": this.createAnsType(ParentElement, "multipleChoice")
        break;
      case "date": this.createAnsType(ParentElement, "date");
        break;
      case "time": this.createAnsType(ParentElement, "time")
        break;
      case "checkbox": this.createAnsType(ParentElement, "checkbox")
        break;
      case "dropdown": this.createAnsType(ParentElement, "dropdown")
        break;
      case "uploadFile": this.createAnsType(ParentElement, "uploadFile")
        break;
      default: console.log('go away kid you need to learn a lot before hacking this website')
    }


  }

  createAnsType(parentNode, QueType) {
    console.log("this is the parent node",parentNode);
    
    //first remove all the existing children if already made
    let questionNumber = parentNode.id;
    questionNumber = questionNumber.substring(2, questionNumber.length)

    for (const index in parentNode.children) {
      if (Number(index) > 2) {
        this.renderer.removeChild(parentNode, parentNode.children[index])
        delete this.subQuestions[Number(questionNumber)]
      }
    }
    if (QueType == 'shortAnswer') {
      let shortAnswer = this.createElementAndAddClass('input', []);
      this.renderer.setAttribute(shortAnswer, 'placeholder', 'your ans will look like this')
      this.renderer.appendChild(parentNode, shortAnswer);
    }
    else if (QueType == 'longAnswer') {
      let longAnswer = this.createElementAndAddClass('textarea', []);
      this.renderer.setAttribute(longAnswer, 'placeholder', 'your ans will look like this')
      this.renderer.appendChild(parentNode, longAnswer);
    }
    else if (QueType == 'multipleChoice') {
      //count of the loaclQuestionCount is 1 less because the question is already formed
      // and value is already incremented so we need to decrease it by 1
      let localQuestionCount = this.questionCount - 1;

      this.addAnotherOption(parentNode, null, false, 'panorama_fish_eye', localQuestionCount)

      //creating the add option btn 
      let addOptionDiv = this.createElementAndAddClass('div', [])
      let addOptionBtnIcon = this.createElementAndAddClass('mat-icon', ['material-icons'])
      let iconText = this.renderer.createText('control_point');
      this.renderer.appendChild(addOptionBtnIcon, iconText);
      //creating the text for add option

      let addOptionText = this.renderer.createText('add another option');
      this.renderer.appendChild(addOptionDiv, addOptionBtnIcon)
      this.renderer.appendChild(addOptionDiv, addOptionText)
      this.renderer.appendChild(parentNode, addOptionDiv);


      //listening to the click for generating new option
      this.renderer.listen(addOptionBtnIcon, 'click', event => {
        this.addAnotherOption(parentNode, addOptionDiv, true, 'panorama_fish_eye', localQuestionCount)
      })

    } else if (QueType == 'date') {
      let dateDiv = this.createElementAndAddClass('div', [])
      let dateIcon = this.createElementAndAddClass('mat-icon', ['material-icons']);
      let dateIconText = this.renderer.createText('date_range');
      let dateInput = this.createElementAndAddClass('input', []);
      this.renderer.setAttribute(dateInput, 'placeholder', 'Date')
      this.renderer.setProperty(dateInput, 'disabled', 'true');
      this.renderer.appendChild(dateDiv, dateInput)
      this.renderer.appendChild(dateIcon, dateIconText);

      this.renderer.appendChild(dateDiv, dateIcon);
      this.renderer.appendChild(parentNode, dateDiv);


    }
    else if (QueType == 'time') {
      let timeDivIcon = this.createElementAndAddClass('div', ['material-icons']);
      let timeDivIconText = this.renderer.createText('access_time');
      let timeInput = this.createElementAndAddClass('input', []);
      this.renderer.setAttribute(timeInput, 'disabled', 'true')
      this.renderer.setAttribute(timeInput, 'placeholder', 'Time')
      this.renderer.appendChild(timeDivIcon, timeInput)

      this.renderer.appendChild(timeDivIcon, timeDivIconText);
      this.renderer.appendChild(parentNode, timeDivIcon)
    }
    else if (QueType == 'checkbox') {
      let localQuestionCount = this.questionCount - 1;

      this.addAnotherOption(parentNode, null, false, 'check_box', localQuestionCount);

      //creating the add option btn 
      let addOptionDiv = this.createElementAndAddClass('div', [])
      let addOptionBtnIcon = this.createElementAndAddClass('mat-icon', ['material-icons'])
      let iconText = this.renderer.createText('control_point');
      this.renderer.appendChild(addOptionBtnIcon, iconText);
      //creating the text for add option

      let addOptionText = this.renderer.createText('add another option');
      this.renderer.appendChild(addOptionDiv, addOptionBtnIcon)
      this.renderer.appendChild(addOptionDiv, addOptionText)
      this.renderer.appendChild(parentNode, addOptionDiv);


      //listening to the click for generating new option
      this.renderer.listen(addOptionBtnIcon, 'click', event => {
        this.addAnotherOption(parentNode, addOptionDiv, true, 'check_box', localQuestionCount)
      })

    }
    else if (QueType == 'dropdown') {
      let localQuestionCount = this.questionCount - 1;

      //for the first time creating the add option field
      let dropDownDiv = this.createElementAndAddClass('div', ['material-icons']);
      let dropdownIcon = this.createElementAndAddClass('input', []);
      this.renderer.setAttribute(dropdownIcon, 'placeholder', 'add option');
      this.renderer.setAttribute(dropdownIcon, 'disabled', 'true')
      this.renderer.appendChild(dropDownDiv, dropdownIcon);
      this.renderer.appendChild(parentNode, dropDownDiv);

      //listening to the add even input listener ;
      this.renderer.listen(dropDownDiv, 'click', event => {
        this.addDropdownOption(parentNode, dropDownDiv, localQuestionCount)
      })
    }
    else if (QueType == 'uploadFile') {
      let fileUploadDiv = this.createElementAndAddClass('div', []);
      let fileUploadIcon = this.createElementAndAddClass('mat-icon', ['material-icons'])
      let fileUploadIconText = this.renderer.createText('cloud_upload');
      this.renderer.appendChild(fileUploadIcon, fileUploadIconText);
      let fileUploadText = this.renderer.createText('Upload file option');

      this.renderer.appendChild(fileUploadDiv, fileUploadIcon)
      this.renderer.appendChild(fileUploadDiv, fileUploadText)
      this.renderer.appendChild(parentNode, fileUploadDiv)

    }
  }


  //function to create dynamic multiple choice question and checkboxes
  addAnotherOption(parentNode, oldChild, flag, icon, questionNumber) {
    //adding the main question number to the option and then we will increment the subqestion number
    if (this.subQuestions.hasOwnProperty(questionNumber)) {
      let subQueNumber = Number(this.subQuestions[questionNumber]);
      subQueNumber++;
      this.subQuestions[questionNumber] = subQueNumber;

      //incrementing the number of options in totalSubQuestionCount
      let subQueCounts:number = Number(this.totalSubQuestionCount[questionNumber]);
      // console.log('current subQcount is ',subQueCounts);
      subQueCounts++;
      this.totalSubQuestionCount[questionNumber] = subQueCounts
      // console.log('current subQcount is ',subQueCounts);
      
    } else {
      this.subQuestions[questionNumber] = 1;
      //assigning value as 1 for the totalSubQuestionCount for the first time
      this.totalSubQuestionCount[questionNumber] = 1;
    }

    //creating the multiple choice icon
    let multiChoiceDiv = this.createElementAndAddClass('div', [])
    let multipleChoiceIcon = this.createElementAndAddClass('mat-icon', ['mat-icon', 'material-icons']);
    let iconText = this.renderer.createText(icon);
    this.renderer.appendChild(multipleChoiceIcon, iconText)

    //creating the input for the multiple choice and checkbox
    let multipleChoiceInput = this.createElementAndAddClass('input', ['multipleChoice']);
    this.renderer.setAttribute(multipleChoiceInput, 'placeholder', 'your Option');
    this.renderer.setAttribute(multipleChoiceInput, 'id', 'SubQ-' + questionNumber + '-' + this.subQuestions[questionNumber])
    this.renderer.appendChild(multiChoiceDiv, multipleChoiceIcon);
    this.renderer.appendChild(multiChoiceDiv, multipleChoiceInput);

    //creating the delelte btn for the option
    let removeOptionIcon = this.createElementAndAddClass('mat-icon', ['material-icons']);
    let removeOptionIconText = this.renderer.createText('remove_circle');
    this.renderer.appendChild(removeOptionIcon, removeOptionIconText);
    this.renderer.appendChild(multiChoiceDiv, removeOptionIcon);
        
    //creating the error text
    let errorText = this.createError(`SUBERROR-${questionNumber}-${this.subQuestions[questionNumber]}`,"please fill this field")
    this.renderer.appendChild(multiChoiceDiv,errorText) ; 

    //listening to the remove icon to remove the option
    this.renderer.listen(removeOptionIcon, 'click', event => {
      this.renderer.removeChild(parentNode, multiChoiceDiv);
      let subQuestionCount:number = Number(this.totalSubQuestionCount[questionNumber]);
      subQuestionCount--;
      this.totalSubQuestionCount[questionNumber] = subQuestionCount;
    })

    if (flag) {
      this.renderer.insertBefore(parentNode, multiChoiceDiv, oldChild)
    } else {
      this.renderer.appendChild(parentNode, multiChoiceDiv)
    }


  }

  addDropdownOption(parentNode, refrenceElement, questionNumber) {
    //making the subquestion count for the dropdown similarly as for multiple choice and checkboxes
    if (this.subQuestions.hasOwnProperty(questionNumber)) {
      let subQueNuber = this.subQuestions[questionNumber];
      subQueNuber++;
      this.subQuestions[questionNumber] = subQueNuber;
      //incrementing the number of options in totalSubQuestionCount
      let subQueCounts:number = Number(this.totalSubQuestionCount[questionNumber]);
      subQueCounts++;
      this.totalSubQuestionCount[questionNumber] = subQueCounts
    } else {
      this.subQuestions[questionNumber] = 1;
      //assigning value as 1 for the totalSubQuestionCount for the first time
      this.totalSubQuestionCount[questionNumber] = 1;
    }
    let dropDownDiv = this.createElementAndAddClass('div', []);
    let dropdownInput = this.createElementAndAddClass('input', ['multipleChoice']);
    this.renderer.setAttribute(dropdownInput, 'id', 'SubQ-' + questionNumber + '-' + this.subQuestions[questionNumber])
    this.renderer.setAttribute(dropdownInput, 'placeholder', 'option ' + this.subQuestions[questionNumber]);
    //creating the error text
    let errorText = this.createError(`SUBERROR-${questionNumber}-${this.subQuestions[questionNumber]}`,"please fill this field")
    this.renderer.appendChild(dropDownDiv,errorText) ; 
    
    this.renderer.appendChild(dropDownDiv, dropdownInput);
    this.renderer.insertBefore(parentNode, dropDownDiv, refrenceElement);

    //creating the btn to remove the option 

    let removeBtn = this.createElementAndAddClass('div', []);
    let removeBtnText = this.renderer.createText('remove_circle');
    this.renderer.appendChild(removeBtn, removeBtnText);
    this.renderer.appendChild(dropDownDiv, removeBtn);


    

    //listening to the remove button to remove the dropdown option
    this.renderer.listen(removeBtn, 'click', event => {
      this.renderer.removeChild(parentNode, dropDownDiv);
      //decrementing the totalSubQuestionCount value as the input is removed
      let subQuestionCount:number = Number(this.totalSubQuestionCount[questionNumber]);
      subQuestionCount--;
      this.totalSubQuestionCount[questionNumber] = Number(subQuestionCount);
    })


  }

  createElementAndAddClass(elementName, classesArray) {
    let element = this.renderer.createElement(elementName);
    for (const index in classesArray) {
      this.renderer.addClass(element, classesArray[index])
    }

    return element;
  }

  createDropdownOptions(text, value) {
    let element = this.createElementAndAddClass('option', [])
    let elementText = this.renderer.createText(text);
    this.renderer.setAttribute(element, 'value', value);
    this.renderer.appendChild(element, elementText);
    return element;
  }

  //this will create the error paragraph 
  createError(questionNumber,text){
    let errorPara = this.createElementAndAddClass('p',['errorText','hideError']);
    let errorText = this.renderer.createText(text);
    this.renderer.setAttribute(errorPara,'id',questionNumber)
    this.renderer.appendChild(errorPara,errorText)
    return errorPara;
  }

  saveForm() {
    this.notifier.hideAll();
    let isFormValid:Boolean = false ;

    let requiredField;
    let mainQuestion;


    //setting the form title and the form description in the finalFormData
    let formTitle = this.element.nativeElement.querySelector('#formTitle')
    let formDescription = this.element.nativeElement.querySelector('#formDescription')

    //checking if we have the form title and the form discription

    if(formTitle.value && formDescription.value && formTitle.value!=" " && formDescription.value!=" " ){

      //setting the form title and form description
      this.finalFormData['formTitle'] = formTitle.value;
      this.finalFormData['formDescription'] = formDescription.value;
   
      
      if(this.QuestionsArray.length>0){
        for (const index in this.QuestionsArray) {
          //making the subQuestions empty first to avoid sub questions duplication
          this.QuestionsArray[index]['subQuestions'] = []
      let currentQuestion = this.QuestionsArray[index];
          //getting the question number from the question id by doing some string manipukation
          let questionNumberText = currentQuestion['qNumber'] ; 
          let questionNumber = Number(questionNumberText.substring(5,questionNumberText.length))
     
      mainQuestion = this.element.nativeElement.querySelector('#' + this.QuestionsArray[index]['qNumber']);
      currentQuestion['question'] = mainQuestion.value
      
      //checking whether the question is required or not by getting the required toggle input
      requiredField = this.element.nativeElement.querySelector('#Req-'+questionNumber).checked
      // if required field is checked we will get true else we get false
      requiredField?currentQuestion['required']=true:currentQuestion['required']=false ;
      let errorText =   this.element.nativeElement.querySelector('#ERROR-'+questionNumber)
   
      //getting the qustion number div and setting gotError class 
      let qDiv = this.element.nativeElement.querySelector('#Q-'+questionNumber);
       
      //checking if any dropdown option is selected or not
          if(mainQuestion.value){
            this.renderer.removeClass(qDiv,'gotError')
            this.renderer.addClass(errorText,'hideError')

       //getting the dropdown error text and removing its class if it is a new question
       let dropError;
       if(questionNumber>this.oldQuestionCount){
        dropError = this.element.nativeElement.querySelector('#DROPERROR-'+questionNumber)
       } 
      
      
       //checking if any dropdown option is selected or not
       if(currentQuestion['qType']){
        questionNumber>this.oldQuestionCount?this.renderer.addClass(dropError,'hideError'):console.log("");//this will hide the error text is everything is fine
              
      //now check the type and if the type is checkbox,dropdown or multiple choice then get the question to 
      if (currentQuestion['qType'] == 'checkbox' || currentQuestion['qType'] == 'dropdown' || currentQuestion['qType'] == 'multipleChoice') {
        //now iterating the for loop and getting the subquestion value from the subQuestion inputs
  
        let questionNumberText = currentQuestion['qNumber'];
  
        let questionNumber = Number(questionNumberText.substring(5, questionNumberText.length))
  
        if (questionNumber != NaN) {
          let subQueLimit = 1;
          let subQueNumber = 1;

        //while loop on the subQuestions limit  
          while (subQueLimit <= Number(this.subQuestions[questionNumber]) && subQueNumber<=Number(this.subQuestions[questionNumber])) {
            // now creating the id of the subquestions 
            let subQuestionNumber = '#SubQ-' + questionNumber + '-' + subQueNumber;
            //now getting the element
            
            let subQueElementInp = this.element.nativeElement.querySelector(subQuestionNumber)
            console.log('this is the element to find ',subQueElementInp);
            //now checking if the element is there if the value is not null the get the input fields value
            if (subQueElementInp != null && subQueElementInp) {  
             console.log('i am inside true condition');
              subQueLimit++;
                           //getting the error text message for the sub question input field
             let subErrorText = this.element.nativeElement.querySelector('#SUBERROR-'+questionNumber+'-'+subQueNumber)
             //checking if subquestion input contains some valid input value
             if(subQueElementInp.value){
              this.renderer.addClass(subErrorText,'hideError')
              this.QuestionsArray[index]['subQuestions'].push(subQueElementInp.value)
             }else{ 
              this.renderer.removeClass(subErrorText,'hideError')
              this.renderer.setAttribute(qDiv,'class','gotError')
              // this.notifier.notify( 'error', 'please fill all questions properly' );  
             }
            }
            subQueNumber++;
          }
        } else {
          console.log("definitely there is some peoblem in the question number");
        }
  
      }
      }else{
              // tell to select dropdown class
              this.renderer.removeClass(dropError,'hideError')
              //highlight the wrong question division
              this.renderer.setAttribute(qDiv,'class','gotError')
      }
          }else{
            this.renderer.setAttribute(qDiv,'class','gotError')
            //getting the error text and showing it
            this.renderer.removeClass(errorText,'hideError')
      
          }
    }
      }else{
        this.notifier.notify( 'error', 'you need to add atleast one question' );
      }
    }else{
    // show error of the field not filled
    this.notifier.notify( 'error', 'please give this form a Title and a Description' );      
  
    }

    this.finalFormData['QuestionsArray'] = this.QuestionsArray;
    

// checking if the form is valid if valid or not
    if(isFormValid){
      console.log(this.finalFormData);
    // sending and saving the file in the database
    this.formService.editForm({ formData: this.finalFormData }).subscribe(data => {
      console.log(data);
      if(data.payload.sucessflag){
        swal({
          position: 'top-end',
          type: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        })
        // this.router.navigate(['/formeditor'])        
        window.location.reload()
      }
    });
    }else{
      this.notifier.notify( 'error', 'form is not valid' );
    }
    
  }


//----------------------------------------------------------this  portion (below) is only for the old form


  //deleting the existing question divs
  deleteQueDiv(qnum){
    //reducing the old question count
    this.oldQuestionCount--
    //first getting the id then getting the main element + getting the question div
    let oldForm = this.element.nativeElement.querySelector('#oldForm');
    let questionDivText:String = '#Q-'+qnum
    let questionDiv = this.element.nativeElement.querySelector(questionDivText)

    //removing the question from the questions array
    for (const index in this.QuestionsArray) {
      if (this.QuestionsArray[index].queNum == qnum) {
        this.QuestionsArray.splice(Number(index),1)
        //removing the subquestion from the subquestions array 
        delete this.subQuestions[qnum]
        break ;
      }
    }
    this.renderer.removeChild(oldForm,questionDiv);
  }

 
  insertOldFormOption(event,type,questionNumber){
    let targetNode = event.target ; 
    let parentNode = this.renderer.parentNode(targetNode);
    let grandParentNode = this.renderer.parentNode(parentNode)
    questionNumber = Number(questionNumber)
    if(type == 'checkbox'){
      this.addAnotherOption(grandParentNode,parentNode,true,'check_box',questionNumber)
    }else if(type == 'multipleChoice'){
      this.addAnotherOption(grandParentNode,parentNode,true,'panorama_fish_eye',questionNumber)
    }else if(type == 'dropdown'){
      this.addDropdownOption(grandParentNode,parentNode,questionNumber)
    }
  }

  removeOldFormOption(event,questionNumber){
    //first decrementing the number of subquestions in the totalsubQuestions  object
    let subQuestionCount = this.totalSubQuestionCount[questionNumber];
    subQuestionCount--;
    this.totalSubQuestionCount[questionNumber] = Number(subQuestionCount);

    let targetNode = event.target ; 
    let parentNode = this.renderer.parentNode(targetNode) ;
    let grandParentNode = this.renderer.parentNode(parentNode);
    this.renderer.removeChild(grandParentNode,parentNode)
  }
}
