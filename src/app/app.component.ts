import { Component, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedImage: string | null = null;
  errorMessage: string | null = null;
  selectedFile: File | null = null;
  
  extractedText: string = '';
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      this.errorMessage = 'Only JPEG and PNG formats are allowed.';
      this.resetSelection();
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.errorMessage = 'File size must be less than 2MB.';
      this.resetSelection();
      return;
    }
    
    this.errorMessage = null;
    this.selectedFile = file;
    this.extractedText = ''; 

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  extractText(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.extractTextFromImage(this.selectedFile).pipe(
      catchError((err) => {
        console.error('Caught by catchError operator:', err);
        return of(null);
      })
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        if (!response) {
          this.errorMessage = 'Received empty response from server.';
          this.cdr.detectChanges();
          return;
        }

        let parsedData = response;
        if (typeof response === 'string') {
          try {
            parsedData = JSON.parse(response);
          } catch (e) {
            console.error('JSON parse error:', e);
          }
        }

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          this.extractedText = parsedData.map((item: any) => item.text || '').join(' ');
        } else {
          this.extractedText = 'No text found.';
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Subscription error block:', err);
        this.errorMessage = 'Failed to extract text.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  copyToClipboard(): void {
    if (this.extractedText) {
      navigator.clipboard.writeText(this.extractedText);
      alert('Text copied to clipboard!'); 
    }
  }

  resetSelection(): void {
    this.selectedImage = null;
    this.selectedFile = null;
    this.extractedText = '';
  }
}