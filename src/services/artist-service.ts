import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Artist } from 'app/interfaces/artist';
import { FileUploaded } from 'app/interfaces/portfolio';
import { Category } from 'app/interfaces/category';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  readonly baseUrl: string = 'http://localhost:8080/api/artists';

  constructor(private http: HttpClient, private router: Router) {}

  getAllArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.baseUrl}`);
  }

  getAllBySearchInput(searchQuery: string): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.baseUrl}?q=${searchQuery}`);
  }

  getArtistById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.baseUrl}/${id}`);
  }

  getArtistByUsername(username: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.baseUrl}/username/${username}`);
  }

  getArtistPortfolioById(id: number): Observable<FileUploaded> {
    return this.http.get<FileUploaded>(`${this.baseUrl}/portfolio/${id}`);
  }

  getAllByCategories(categories: Category[]): Observable<Artist[]> {
    return this.http.post<Artist[]>(`${this.baseUrl}/filter`, categories);
  }

  getAllByCategoriesAndPriceRange(
    categories: string[],
    minPrice: number,
    maxPrice: number
  ): Observable<Artist[]> {
    return this.http.post<Artist[]>(`${this.baseUrl}/filter`, {categories, minPrice, maxPrice});
  }

  getAllByPriceRange(minPrice: number, maxPrice: number): Observable<Artist[]> {
    let params = new HttpParams();
    params = params.append('minPrice', minPrice.toString());
    params = params.append('maxPrice', maxPrice.toString());

    return this.http.get<Artist[]>(`${this.baseUrl}/search`, { params });
  }
}
