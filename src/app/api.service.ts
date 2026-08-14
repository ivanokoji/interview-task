import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
  private apiUrl = 'https://api.api-ninjas.com/v1/imagetotext'; 
  
  
  private apiKey = 'X8BcKCsqxEhbq3ZVgsNbFiiPDdyQsOGH4p0FaMMW'; 

  constructor(private http: HttpClient) {}

  extractTextFromImage(file: File): Observable<any> {

    const formData = new FormData();
    formData.append('image', file);

    
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey
    });

    
    return this.http.post(this.apiUrl, formData, { headers });
  }
}