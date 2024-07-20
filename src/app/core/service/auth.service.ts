import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _HttpClient: HttpClient) {}

  baseurl: string = `https://note-sigma-black.vercel.app/api/v1/users/`;
  register(userData: object): Observable<any> {
    return this._HttpClient.post(this.baseurl + 'signUp', userData);
  }
  login(userData: object): Observable<any> {
    return this._HttpClient.post(this.baseurl + 'signIn', userData);
  }
}
