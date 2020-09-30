import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client'
import {  ActivatedRoute } from '@angular/router';
import { CryptoServiceService } from '../services/crypto-service.service';
import { EditorService } from '../services/editor.service';

const SOCKET_ENDPOINT = 'localhost:3000';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute, private editorService : EditorService, private cryptoService : CryptoServiceService) { }
  
  message : string;
  private socket : any;
  urlKey : string;
  isTextAreaVisible : boolean;
  

  ngOnInit(): void {
    this.activeRoute.params.subscribe(routeParams => {
     this.urlKey = routeParams.id;
     this.initEditor();
    });
    
  }

//Gets message from the server, then call setupSocketConnection();
initEditor(){
  this.editorService.getAPIData(this.urlKey).subscribe((response)=>{
     //comparing this so we don't have to call all those methods setup connection 
    if(response["url"] == this.urlKey && response['hmac'] ==  this.cryptoService.createHmacSHA1(response['message'],  this.urlKey)){
      this.message = this.cryptoService.decryptUsingAES256(response['message'], this.urlKey);
      this.setupSocketConnection();
      this.isTextAreaVisible = true;
       //slicing because devrypting adds an extra " to  the beggining and end
      this.message = this.message.slice(1, -1);
    }else{
      this.isTextAreaVisible = false;
    }
     
  },(error) => {
    console.log('error is ', error);
    this.isTextAreaVisible = false;
})
}

  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);
    this.socket.on('message-broadcast', (data, hash, urlKey) => {
      //comparing this so we don't have to call all those methods if they are not the same, they will fail anyway
      if(urlKey == this.urlKey){
        var currentHash = this.cryptoService.createHmacSHA1(data, urlKey);
        if(currentHash === hash){
          this.message = this.cryptoService.decryptUsingAES256(data, urlKey);
          //slicing because devrypting adds an extra " to  the beggining and end
          this.message = this.message.slice(1, -1); 
          //TODO handle if message was tempered with
        } else {
          console.log('they were tempered with');
        }
      }else{
        console.log('they were not from the same url');
      }
    });
 }

 SendMessage(){
  var encryptedMessage =  this.cryptoService.encryptUsingAES256(this.message, this.urlKey);
  var hash = this.cryptoService.createHmacSHA1(encryptedMessage, this.urlKey);
  this.socket.emit('message', encryptedMessage, hash, this.urlKey);
 }

}
