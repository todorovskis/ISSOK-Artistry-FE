import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { Router } from '@angular/router';
import { Offer } from 'app/interfaces/offer';
import { FileUploaded } from 'app/interfaces/portfolio';
import { AuthService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  readonly baseUrl: string = 'http://localhost:8080/api/offers';
  private offerContentUploaded = new Subject<boolean>();
  private headers: HttpHeaders;
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) 
  {
    const token = authService.getToken();  
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
  }

  getOffersForClient(clientUsername: string): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}/client/${clientUsername}`);
  }
  getOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}`)
  }
  getOffer(offerId: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.baseUrl}/view-offer/${offerId}`)
  }

  getAllOffersBySearchInput(searchQuery: string): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}?q=${searchQuery}`)
  }

  signUpArtistToOffer(offerId: number): Observable<Offer> {
    return this.http.post<Offer>(
      `${this.baseUrl}/sign-up-artist-to-offer`,
      { offerId }
    );
  }

  assignArtistToOffer(artistId: number, offerId: number): Observable<Offer> {
    return this.http.post<Offer>(`${this.baseUrl}/assign-artist-on-offer`, {
      artistId,
      offerId,
    });
  }

  unassignOffer(offerId: number): Observable<Offer> {
    return this.http.post<Offer>(`${this.baseUrl}/unassign-offer`, {offerId:offerId});
  }

  removeSignedUpArtistFromOffer(offerId: number,artistUsername: string): Observable<any> {
    console.log('offerId:', offerId);
    console.log('artistUsername:', artistUsername);
    return this.http.post<any>(`${this.baseUrl}/cancel-sign-up`, {offerId:offerId, artistUsername:artistUsername});
  }

  createOffer(formData: FormData) {
    var title = formData.get('title')?.toString();
    var description = formData.get('description')?.toString();
    var status = 'PENDING';
    var timeCreated = new Date().getTime();
    var price = formData.get('price')?.toString();
    var categories = JSON.parse(formData.get('categories') as string);
    const selectedImageUrl = formData.get('selectedImageUrl')?.toString();
    var mode = formData.get('tournament')?.toString();

    return this.http.post<Offer>(`${this.baseUrl}/create`, {
      title,
      description,
      status,
      timeCreated,
      price,
      categories, 
      selectedImageUrl,
      mode
    }, { headers: this.headers });
  }

  getOfferContentById(id: number): Observable<FileUploaded> {
    return this.http.get<FileUploaded>(`${this.baseUrl}/content/${id}`);
  }

  getOfferContentUpdated(): Observable<boolean> {
    return this.offerContentUploaded.asObservable();
  }

  deleteOffer(offerId: number) {
    return this.http.post<any>(`${this.baseUrl}/delete`, {offerId});
  }
  updateOffer(formData: FormData) {
    var id = formData.get('id');
    var title = formData.get('title');
    var description = formData.get('description');
    var price = formData.get('price');
    var categories = JSON.parse(formData.get('categories') as string);

    return this.http.post<Offer>(`${this.baseUrl}/update`, {
      id,
      title,
      description,
      price,
      categories,
    });
  }
  completeOffer(offerId: number): Observable<Offer> {
    return this.http.post<Offer>(`${this.baseUrl}/complete`, {offerId})
  }

  getAllByPriceRange(minPrice: number, maxPrice: number): Observable<Offer[]> {
    let params = new HttpParams();
    params = params.append('minPrice', minPrice.toString());
    params = params.append('maxPrice', maxPrice.toString());

    return this.http.get<Offer[]>(`${this.baseUrl}/search`, { params });
  }

  getSignedUpOffersForArtist(artistUsername: string): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}/view-signed-up-offers/${artistUsername}`)
  }

  getWorkingOnoffersForArtist(artistUsername: string): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}/view-working-on-offers/${artistUsername}`)
  }

  uploadFileForOffer(formData: FormData): Observable<Offer> {
    return this.http.post<Offer>(`${this.baseUrl}/content-to-offer`, formData);
  }
}
