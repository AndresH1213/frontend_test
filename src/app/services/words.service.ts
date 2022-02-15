import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WordsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('an-token') || '';
  }

  get getHeaders() {
    return {
      headers: {
        Authorization: this.token,
      },
    };
  }

  getAllwords() {
    const url = `${this.baseUrl}/words/all`;
    return this.http.get(url, this.getHeaders);
  }

  getOneWord(id: string) {
    const url = `${this.baseUrl}/words/${id}`;
    return this.http.get(url, this.getHeaders);
  }

  createWord(body: any) {
    const url = `${this.baseUrl}/words`;
    return this.http.post(url, body, this.getHeaders);
  }

  updateWord(id: string, body: any) {
    const url = `${this.baseUrl}/words/${id}`;
    return this.http.patch(url, body, this.getHeaders);
  }

  deleteWord(id: string) {
    const url = `${this.baseUrl}/words/${id}`;
    return this.http.delete(url, this.getHeaders);
  }
}
