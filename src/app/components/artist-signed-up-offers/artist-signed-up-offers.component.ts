import { Component, OnInit } from '@angular/core';
import { Offer } from 'app/interfaces/offer';
import { OfferService } from 'services/offer-service';
import { NavigationComponent } from '../navigation/navigation.component';
import { AuthService } from 'services/user-service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'artist-signed-up-offers',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationComponent],
  templateUrl: './artist-signed-up-offers.component.html',
  styleUrl: './artist-signed-up-offers.component.css',
})
export class ArtistSignedUpOffersComponent implements OnInit {
  signedUpOffers: Offer[] = [];
  completedOffers: Offer[] = [];
  workingOnOffers: Offer[] = [];
  username: string | undefined;

  constructor(
    private offerService: OfferService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsernameForUser();
    if (this.username) {
      this.offerService
        .getWorkingOnoffersForArtist(this.username)
        .subscribe((workingOnOffers) => {
          for (var offer of workingOnOffers) {
            if (offer.status == 'COMPLETED') {
              this.completedOffers.push(offer);
            } else if (offer.status == 'IN_PROGRESS') {
              this.workingOnOffers.push(offer);
            }
          }
        });
      this.offerService
        .getSignedUpOffersForArtist(this.username)
        .subscribe((signedUpOffers) => (this.signedUpOffers = signedUpOffers));
    }
  }

  removeArtistFromSignUp(offerId: number): void {
    if (this.username) {
      this.offerService
        .removeSignedUpArtistFromOffer(offerId, this.username)
        .pipe(
          switchMap(() =>
            this.offerService.getSignedUpOffersForArtist(this.username!)
          )
        )
        .subscribe((signedUpOffers) => (this.signedUpOffers = signedUpOffers));
    }
  }
}