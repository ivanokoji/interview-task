import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.api-ninjas.com/v1/imagetotext';
  private apiKey = 'YOUR_API_KEY'; // Make sure your key is here

  constructor(private http: HttpClient) {}

  extractTextFromImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
      // DO NOT manually set 'Content-Type': 'multipart/form-data'. 
      // Angular and the browser must set it automatically with the boundary token!
    });

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}