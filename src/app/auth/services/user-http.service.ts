import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserHttpService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/api/users`;

    create(user: string): Observable<User> {
        return this.http.post<User>(this.apiUrl, { email: user });
    }

}