import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.api-ninjas.com/v1/imagetotext';
  private apiKey = 'YOUR_API_KEY'; 

  constructor(private http: HttpClient) {}

  extractTextFromImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const headers = new HttpHeaders({
      'x-api-key': this.apiKey
      
    });

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}