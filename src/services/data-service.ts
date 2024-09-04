import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'app/interfaces/category';
import { Country } from 'app/interfaces/country';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient,
    private router: Router
  ) { }

    getCountries(): Observable<Country[]> {
        return this.http.get<Country[]>(`http://localhost:8080/api/countries`)
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`http://localhost:8080/api/categories`)
    }
}
