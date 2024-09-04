import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {

  private apiUrl = 'http://localhost:2025/api'
  employeeResponse: any;
  constructor(private http: HttpClient) {}

  addEmployee(userData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const urlStr = `${this.apiUrl}/employees`;
    const headers = new HttpHeaders({
      'Authorization': token
    });
    return this.http.post(urlStr, userData, { headers });
  }

  sendOTP(email: string): Observable<any>{
    const urlStr = `${this.apiUrl}/auth/request-otp`;
    return this.http.post(urlStr, { email });
  }

  verifyOTP(email: string, otp: string): Observable<any>{
    const urlStr = `${this.apiUrl}/auth/verify-otp`;
    return this.http.post(urlStr, { email, otp });
  }  

  getEmployees(order: number, limit: number, page: number, payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found in local storage');
    }
    const tokenStr = token.startsWith('Bearer ') ? token.substring(7) : token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tokenStr}`,
      'Content-Type': 'application/json'
    });

    let params = new HttpParams()
      .set('order', order.toString())
      .set('page', page.toString());

    Object.keys(payload).forEach(key => {
      if (payload[key]) { 
        params = params.set(key, payload[key]);
      }
    });

    const urlStr = `${this.apiUrl}/employees`;
    return this.http.get(urlStr, { headers, params });
  }

  updateEmployeeStatus(employeeId: string, action: 'activate' | 'deactivate'): Observable<any> {
    const url = `${this.apiUrl}/${action}/${employeeId}`;
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found in local storage');
    }
    const tokenStr = token.startsWith('Bearer ') ? token.substring(7) : token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${tokenStr}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(url, {}, { headers });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

}

