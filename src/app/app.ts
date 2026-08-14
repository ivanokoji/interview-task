import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class AppComponent {
 selectedImage: string | null=null;
 errorMessage: string | null=null;
 selectedFile: File | null=null;

 onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
    if(!input.files || input.files.length === 0) {

      return;
    }

    const file = input.files[0];
      if (file.type !== 'image.jpeg' && file.type !== 'image/png') {
       this.errorMessage = 'Only JPEG and PNG formats are allowed.';
       this.resetSelection();
       return;
  }
  const maxSizeInBytes = 2 * 1024 * 1024;
  if(file.size > maxSizeInBytes) {
    this.errorMessage = 'File size must be less than 2MB.';
    this.resetSelection();
    return;
  }
  this.errorMessage = null;
  this.selectedFile = file;
  
  const reader = new FileReader();
  reader.onload = () => {
    this.selectedImage = reader.result as string;
  };

  reader.readAsDataURL(file);

  }
  resetSelection(): void {
    this.selectedImage = null;
    this.selectedFile = null;
  }

 }

