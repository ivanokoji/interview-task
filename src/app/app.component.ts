import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

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


  constructor(private apiService: ApiService) {}

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
    };

    reader.readAsDataURL(file);
  }

 
  extractText(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.extractTextFromImage(this.selectedFile).subscribe({
      next: (response) => {
        
        if (response && response.length > 0) {
          this.extractedText = response.map((item: any) => item.text).join(' ');
        } else {
          this.extractedText = 'No text found in this image.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to extract text. Please check your API key and try again.';
        this.isLoading = false;
        console.error(err);
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