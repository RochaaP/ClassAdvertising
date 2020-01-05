import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/service/auth/authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-classes-institute',
  templateUrl: './classes-institute.component.html',
  styleUrls: ['./classes-institute.component.scss']
})
export class ClassesInstituteComponent implements OnInit {


  tabs = [];
  cards = [];
  tempNew = [];

  selected = new FormControl(0);
  selectedCard = new FormControl(0);

  panelOpenState = false;

  nameInput: string;
  id: string;

  classInput = '';
  timeInput = '';
  dayInput = '';
  mediumInput = '';
  classTypeInput = '';
  firstNameInput = '';
  ageInput = '';
  cityInput = '';
  DistrictInput = '';
  subjectInput = '';

  userDetails: any;
  detailss: any;
  details: any;
  registerItem: string;
  email: string;
  response: any = [];
  recievedContent: any;

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.nameInput = '';
    this.userDetails = this.authService.isUserLoggedIn();
    this.registerItem = JSON.parse(localStorage.getItem('registerItem'));
    if (this.userDetails != null) {
      this.email = this.userDetails.email;
      this.getExistingValues();
    }
  }

  addTab(selectAfterAdding: boolean) {
    this.tabs.push(this.nameInput);
    this.nameInput = '';

    if (selectAfterAdding) {
      // this.selected.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    delete this.tabs[index];
  }
  removeDe(index: number) {
    // delete this.cards[index];
    // this.cards.splice(index, 1);
    // delete this.cards[index];
    this.cards.forEach(o => {
      console.log('asjdkgh' + o.index);
  });
    console.log(this.cards);
  }

  submit(index: number) {
    this.details = {
      index,
      subject: this.subjectInput,
      primary: this.tabs[index],
      city: this.cityInput,
      district: this.DistrictInput,
      class: this.classInput,
      time: this.timeInput,
      day: this.dayInput,
      medium: this.mediumInput,
      classType:  this.classTypeInput

    };
    this.cards.push(this.details);
    this.tempNew.push(this.details);
    (document.getElementById('buttonUploadAll') as HTMLInputElement).disabled = false;

  }
  upload() {
    let values;
    values = {
      id: this.id,
      registerItem: this.registerItem,
      email: this.userDetails.email,
      content : this.cards
    };

    this.postAPIData(values).subscribe((response) => {
      console.log('response from POST API is ', response);
    }, (error) => {
      console.log('error during post is ', error);
    });

    this.classInput = '';
    this.timeInput = '';
    this.dayInput = '';
    this.mediumInput = '';
    this.classTypeInput = '';
    this.cityInput = '';
    this.DistrictInput = '';
    this.subjectInput = '';

    (document.getElementById('buttonUploadAll') as HTMLInputElement).disabled = true;
    this.cards.splice(0, this.cards.length);
    this.tabs.splice(0, this.tabs.length);
    this.tempNew.splice(0, this.tempNew.length);
  }

  postAPIData(userValues: object) {
  return this.http.post('api/uploadClasses/institute', userValues);
  }

  getExistingValues() {
    this.getAPIData().subscribe((response) => {
      // this.response = response[0].data.content;
      if (response[0].id ==  null){
        const id = this.afs.createId();
        this.id = id;
      }
      else {
        this.id = response[0].id;
      }
      this.cards = response[0].data.content;
      console.log("thist is the response card" + this.cards);
      console.log('response from POST API is ', response);
    }, (error) => {
      console.log('error during post is ', error);
    });
  }


  getAPIData() {
    return this.http.post('api/getClasses/institute', {email: this.email});
  }


  delete(index: number) {

  }
  update(id: string) {
    // this.updateAPIData().subscribe((response) => {
    //   // this.response = response[0].data.content;
    //   this.response = response;
    //   console.log(this.response);
    //   console.log('response from POST API is ', response);
    // }, (error) => {
    //   console.log('error during post is ', error);
    // });
  }


  updateAPIData() {
    return this.http.post('api/getClasses/person', {email: this.email});
  }
}
