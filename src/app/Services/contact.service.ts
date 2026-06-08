import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactRequest {
  from_name: string;
  from_email: string;
  message: string;
  website?: string;
}

export interface ContactResponse {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {}

  sendMessage(data: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${environment.apiUrl}/contact`, data);
  }
}
