import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoServiceService } from './crypto-service.service';


const CONFIG = {baseUrl:'http://localhost:3000/', getDocumentEndpoint: "getDocument/", createDocument: 'createDocument', documentRoute: '/document/'};
@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor(private http: HttpClient, private router: Router, private cryptoService : CryptoServiceService) { }


  //TODO have config object and read base url and other api endpoint from there
  getAPIData(parameter){
    return this.http.get(CONFIG.baseUrl + CONFIG.getDocumentEndpoint + parameter);
  }

  createNewDocument() {
    var randomString = this.cryptoService.getRandomString(14);
    var documentId = { id : randomString, hmac: this.cryptoService.createHmacSHA1('', randomString)};
    const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');

    this.http.post(CONFIG.baseUrl + CONFIG.createDocument, JSON.stringify(documentId), {
      headers: headers
    })
    .subscribe(data => {
      console.log(data);
    });
    this.router.navigate([CONFIG.documentRoute, randomString]);
    
  }
}