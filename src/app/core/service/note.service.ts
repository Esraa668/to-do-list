import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  baseurl: string = `https://note-sigma-black.vercel.app/api/v1/`;

  constructor(private _HttpClient: HttpClient) {}

  ADDNote(userNote: object): Observable<any> {
    const headers = new HttpHeaders({
      token: localStorage.getItem('token') || '',
    });

    return this._HttpClient.post(this.baseurl + 'notes', userNote, { headers });
  }

  getUserNote(): Observable<any> {
    const headers = new HttpHeaders({
      token: localStorage.getItem('token') || '',
    });

    return this._HttpClient.get(this.baseurl + 'notes', { headers });
  }

  DeleteUserNote(id: any, i: number): Observable<any> {
    const headers = new HttpHeaders({
      token: localStorage.getItem('token') || '',
    });

    return this._HttpClient.delete(`${this.baseurl}notes/${id}`, { headers });
  }
  UpdateUserNote(userNoteData: User, id: any): Observable<any> {
    const headers = new HttpHeaders({
      token: localStorage.getItem('token') || '',
    });

    return this._HttpClient.put(`${this.baseurl}notes/${id}`, userNoteData, {
      headers,
    });
  }
}
