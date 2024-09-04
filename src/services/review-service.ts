import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from 'app/interfaces/review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  readonly baseUrl: string = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  getReviewsByArtist(artistId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/${artistId}`);
  }

  submitReviewForOffer(offerId: number, formData: FormData) {
    var title = formData.get('title')?.toString();
    var review = formData.get('review')?.toString();
    var grade = formData.get('grade')?.toString();
    var timeCreated = formData.get('timeCreated')?.toString();

    return this.http.post<any>(`${this.baseUrl}/submit`, {
      offerId,
      title,
      review,
      grade,
      timeCreated,
    });
  }
}
