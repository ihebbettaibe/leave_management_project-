import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Upload profile picture
  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    // Change the URL to your backend endpoint
    return this.http.post('/api/profile/upload-picture', formData);
  }

  // ...other methods (getProfile, updateProfile, etc.)
}
