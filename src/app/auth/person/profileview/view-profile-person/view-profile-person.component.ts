import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../../../service/share/data.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DialogComponent } from '../../../../messages/dialog/dialog.component';
import { ConfirmationComponent } from '../../../../messages/confirmation/confirmation.component';
import { AuthenticationService } from 'src/app/service/auth/authentication.service';

@Component({
  selector: 'app-view-profile-person',
  templateUrl: './view-profile-person.component.html',
  styleUrls: ['./view-profile-person.component.scss']
})
export class ViewProfilePersonComponent implements OnInit {

  email: string;
  response: any;

  instructorEmail: string;
  studentEmail: string;

  topic: string;
  description: string;
  result: any;

  constructor(
    private data: DataService,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthenticationService

  ) { }

  ngOnInit() {
    // this.data.currentEmail.subscribe(message => this.email = message);
    // if (!this.email) {
      this.email = localStorage.getItem('navigateUser');
      this.instructorEmail = this.email;
      this.studentEmail = this.authService.isUserLoggedIn().email;

      console.log('email from local storage '+ this.email + '  ' +this.studentEmail);
    // }

    // this.email = localStorage.getItem('emailtemp');
    // console.log("hereh here" +this.email);
    // if (localStorage.getItem('emailtemp') && (this.email)) {
    //   this.email = localStorage.getItem('emailtemp');
    //   console.log("hearaer on hahd", this.email)

    // }

      this.getAPIData().subscribe((response) => {
      console.log('response from get user details ', response);
      this.response = response;
    }, ( error) => {
      console.log('error is ', error);
    });
  }

  getAPIData() {
    return this.http.post('/api/getUserData/person', {email: this.email} );
  }

  // appointment() {
  //   this.data.passEmail(this.email);
  //   this.router.navigate(['/messages']);
  // }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '400px',
      width: '600px',
      data: {topic: this.topic, description: this.description}
    });

    dialogRef.afterClosed().subscribe(result => {
     if (result) {
       this.result = result;
       this.openConfirmation();
     }
    //  console.log('from null '+result);
    });
  }

  openConfirmation(): void {
    const dialogConf = this.dialog.open(ConfirmationComponent, {
      data: {topic: this.result.topic, description: this.result.description}
    });

    dialogConf.afterClosed().subscribe(result => {
      if (result) {
        this.postData();
      }
    });
  }

  postData() {
    let userValues = {};

    // this.content = {
    //   topic: this.result.topic,
    //   description: this.result.description,
    //   email: this.email
    // };

    userValues = {
      instructorEmail: this.instructorEmail,
      // content: this.content,
      topic: this.result.topic,
      description: this.result.description,
      studentEmail: this.studentEmail
    };

    this.postAPIData(userValues).subscribe((response) => {
      console.log('response ffrom appointments ', response);
      this.response = response;
    });
  }

  postAPIData(userValues: object) {
    return this.http.post('api/appointments/makeAppointment', userValues);
  }


}
