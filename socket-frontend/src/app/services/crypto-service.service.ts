import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoServiceService {

  constructor() { }

   getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}


//encrypts given string "value", with key, returns the encrypted string
encryptUsingAES256(value : string, key : string) : string {
  let _key = CryptoJS.enc.Utf8.parse(key);
  let _iv = CryptoJS.enc.Utf8.parse(key);
  let encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(value), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding
    });
  return encrypted.toString();
}

//decrypts given string "value", with key, returns the encrypted string
decryptUsingAES256(value : string, key : string) : string {
  let _key = CryptoJS.enc.Utf8.parse(key);
  let _iv = CryptoJS.enc.Utf8.parse(key);

  let decrypted = CryptoJS.AES.decrypt(
      value, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.CFB,
      padding: CryptoJS.pad.NoPadding
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
}

createHmacSHA1(value : string, key : string) : any{
   return CryptoJS.HmacSHA1(value, key).toString();
}


}
