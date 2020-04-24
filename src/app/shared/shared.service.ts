import { Injectable, Output, EventEmitter } from '@angular/core';
import { UserModel } from '../users/user-model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public viewPaperWidth = 20;
  public createPaperWidth = 75;
  public sidePanelWidth = 5;

  private loggedInUser: {id: string, data: UserModel};
  
  private studentPicUrl: string = "https://firebasestorage.googleapis.com/v0/b/mtute-sl.appspot.com/o/profilePictures%2FDefault%2Fstudent.jpg?alt=media&token=f61b56c0-f737-45d4-bfc3-3dba1de9683f";
  
  private teacherPicUrl: string = "https://firebasestorage.googleapis.com/v0/b/mtute-sl.appspot.com/o/profilePictures%2FDefault%2FInstructor.jpg?alt=media&token=217f5045-c06a-4ce4-a21b-5efc533171b2";

  @Output() language: EventEmitter<any> = new EventEmitter();
  @Output() addTabItem: EventEmitter<any> = new EventEmitter();
  @Output() createPaperWidthEvent: EventEmitter<any> = new EventEmitter();
  @Output() loadPaperWithData: EventEmitter<any> = new EventEmitter();
  @Output() viewPaperRefresh: EventEmitter<any> = new EventEmitter();
  @Output() navigationRefresh: EventEmitter<any> = new EventEmitter();
  @Output() userLoggedIn: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public getLoggedInUser(){
    // return this.loggedInUser;
    let user = this.loggedInUser;
    // user == undefined? user = JSON.parse(sessionStorage.getItem("loggedInUser")):"";
    user == undefined? user = JSON.parse(localStorage.getItem("loggedInUser")): 
                              JSON.parse(localStorage.getItem("loggedInUser")) == undefined? this.setLoggedInUser(user):"";
    return user;
  }

  public setLoggedInUser(user: {id: string, data: UserModel}, storage: string = "LOCAL"){
    this.loggedInUser = user;
    if(storage == "LOCAL"){
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    }
    else{
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    }
  }

  public getZoomAccessToken(){
      return JSON.parse(localStorage.getItem("zoomAccessToken"));
  }

  public setZoomAccessToken(token: any){
    let expiryTime = (new Date()).getUTCSeconds() + 3500;
    localStorage.setItem("zoomAccessTokenExpiry", expiryTime.toString());
    localStorage.setItem("zoomAccessToken", JSON.stringify(token));
    return token;
  }

  public clearZoomAccessToken(){
    return localStorage.removeItem("zoomAccessToken");;
  }

  public getStudentPicUrl(){
    return this.studentPicUrl;
  }

  public getTeacherPicUrl(){
    return this.teacherPicUrl;
  }

  public userLoggedInRequest(){
    this.userLoggedIn.emit();
  }

  public userLoggedInRespond() {
    return this.userLoggedIn;
  }

  public languageRequest(language: string){
    this.language.emit({
      lang: language 
    })
  }

  public languageRespond() {
    return this.language;
  }

  public addTabItemRequest(data) {
    this.addTabItem.emit({
      data: data 
    })
  }

  public addTabItemRespond() {
    return this.addTabItem;
  }

  public changeCreatePaperWidthRequest() {
    this.createPaperWidthEvent.emit({
      data: this.createPaperWidth
    })
  }
  
  public changeCreatePaperWidthRespond() {
    return this.createPaperWidthEvent;
  }

  public loadPaperWithDataRequest(data: any) {
    this.loadPaperWithData.emit({
      paper: data
    });
  }

  public loadPaperWithDataRespond() {
    return this.loadPaperWithData;
  }

  public viewPaperRefreshRequest() {
    this.viewPaperRefresh.emit();
  }

  public viewPaperRefreshRespond() {
    return this.viewPaperRefresh;
  }

  public navigationRequest() {
    this.navigationRefresh.emit();
    console.log('sharedService navigation emit called');
  }

  public navigationRespond() {
    return this.navigationRefresh;
  }

}
