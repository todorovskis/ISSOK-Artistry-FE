import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Offer } from 'app/interfaces/offer';
import { switchMap, of } from 'rxjs';
import {  map } from 'rxjs/operators'; // Import map here
import { OfferService } from 'services/offer-service';
import { NavigationComponent } from '../navigation/navigation.component';
import { ArtistBrief } from 'app/interfaces/artist-brief';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'services/user-service';
import { NgClass } from '@angular/common';
import { OfferContent } from '../offer-content/offer-content.component';
import { ArtistService } from 'services/artist-service';
import { ReviewService } from 'services/review-service';

@Component({
  selector: 'offer-details',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationComponent, NgClass, OfferContent],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details-component.css',
})
export class OfferDetailsComponent implements OnInit {
  offer: Offer | undefined;
  selectedArtist: ArtistBrief | undefined;
  workingArtistOffers: Offer[] = [];
  isCurrentArtistWorkingOnOffer: boolean = false;
  isCurrentArtistSignedUpOnOffer: boolean = false;
  reviewLeft:boolean  =false;
  
  artistsForm!: FormGroup;
  userRole: string | undefined;
  username: string | undefined;
  offerContentForm!: FormGroup;
  selectedFile: File | undefined;
  artists: ArtistBrief[] = [];
  artistsSignedUp: ArtistBrief[] = [];
  currentLoggedInArtistSignedUp: ArtistBrief | undefined;
  artistSignedUpOffers: Offer[] = [];
  signedUpOffersForArtist: Offer[] = [];

  createReviewForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private authService: AuthService,
    private artistService: ArtistService,
    private reviewService: ReviewService
  ) {
    this.isCurrentArtistWorkingOnOffer = false;
    this.createReviewForm = new FormGroup({});
  }

  ngOnInit(): void {
    // Initialize forms
    const controlOptions: AbstractControlOptions = { updateOn: 'submit' };
  
    this.createReviewForm = this.formBuilder.group({
      title: ['', Validators.required],
      review: ['', Validators.required],
      grade: ['', Validators.required],
    });
  
    this.offerContentForm = this.formBuilder.group({
      offerId: ['', Validators.required],
      contentFile: ['', Validators.required],
    });
  
    this.artistsForm = this.formBuilder.group({
      selectedArtist: ['', Validators.required],
    });
  
    // Get user role and username
    this.username = this.authService.getUsernameForUser();
    this.userRole = this.authService.getUserRole();
  
    // Fetch offer details
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = +params.get('id')!;
          return this.offerService.getOffer(id).pipe(
            switchMap((offer) => {
              this.offer = offer;
              console.log('Offer:', this.offer);
  
              if (this.userRole === 'ARTIST') {
                // Fetch signed-up offers for artist
                return this.offerService.getSignedUpOffersForArtist(this.username!).pipe(
                  map((offers) => {
                    this.artistSignedUpOffers = offers;
                    console.log('Signed-up offers:', this.artistSignedUpOffers);
  
                    // Check if the current offer is in signed-up offers
                    this.isCurrentArtistSignedUpOnOffer = this.artistSignedUpOffers.some(
                      (offer) => offer.id === this.offer?.id
                    );
                    console.log(
                      this.isCurrentArtistSignedUpOnOffer
                        ? 'Offer is in signed up offers'
                        : 'Offer is not in signed up offers'
                    );
                    return offers;
                  })
                );
              } else {
                // Return an empty array or default value for clients
                return of([]);
              }
            })
          );
        })
      )
      .subscribe((offers) => {
        // Perform any additional logic after fetching the offer and role-specific data
        if (this.userRole === 'CLIENT') {
          // Handle client-specific logic if needed
          console.log('Client viewing offer');
        }
      });

      this.offerService.getWorkingOnoffersForArtist(this.username!!).subscribe(
        workingOnOffers => { this.isCurrentArtistWorkingOnOffer =  workingOnOffers.some(
          (offer) => offer.id === this.offer?.id
        ); }
      )
  }
  

  handleRadioClick(artist: ArtistBrief) {
    this.selectedArtist = artist;
  }
  onCompleteOffer() {
    if (!this.createReviewForm.invalid) {
      const formData = new FormData();
      formData.append('title', this.createReviewForm.get('title')?.value);
      formData.append('review', this.createReviewForm.get('review')?.value);
      formData.append('grade', this.createReviewForm.get('grade')?.value);
      formData.append('timeCreated', Date.now().toString());

      this.reviewService
        .submitReviewForOffer(this.offer?.id!, formData)
        .subscribe(() => {this.reviewLeft = true});
    }

    this.offerService
      .completeOffer(this.offer?.id!)
      .subscribe((offer) => (this.offer = offer));
  }
  onSubmit() {
    this.offerService
      .assignArtistToOffer(this.selectedArtist?.id!, this.offer?.id!)
      .subscribe((offer) => {
        this.offer = offer;
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onContentSubmit() {
    if (!this.selectedFile || !this.offer || !this.offer.id) {
      return;
    }

    const formData = new FormData();
    formData.append('content', this.selectedFile, this.selectedFile.name);
    formData.append('offerId', this.offer.id.toString());
    formData.append('artistUsername', this.username!!);

    this.offerService.uploadFileForOffer(formData).subscribe((offer) => {
      this.router.navigateByUrl(`/offers/details/${this?.offer?.id}`);
    });
  }

  isArtistSignedUpOnOffer(offerId: number): boolean {
    for (var offer of this.signedUpOffersForArtist) {
      if (offer.id == offerId) {
        return true;
      }
    }
    return false;
  }

  signUpArtistToOffer(offerId: number) {
    if (this.username) {
      this.offerService
        .signUpArtistToOffer(offerId)
        .pipe(
          switchMap(() =>
            this.offerService.getSignedUpOffersForArtist(this.username!)
          )
        )
        .subscribe((signedUpOffersForArtist) => {
          this.signedUpOffersForArtist = signedUpOffersForArtist;
          this.isCurrentArtistSignedUpOnOffer = true;
        });
    }
  }

  removeArtistFromSignUp(offerId: number): void {
    console.log('removeArtistFromSignUp called with offerId:', offerId);
    if (this.username) {
      this.offerService
        .removeSignedUpArtistFromOffer(offerId, this.username)
        .pipe(
          switchMap(() =>
            this.offerService.getSignedUpOffersForArtist(this.username!)
          )
        )
        .subscribe((signedUpOffersForArtist) => {
          this.signedUpOffersForArtist = signedUpOffersForArtist;
          this.isCurrentArtistSignedUpOnOffer = false;
        });
    }
  }

  unassignOffer(offerId: number) {
    this.offerService
      .unassignOffer(offerId)
      .subscribe((offer) => (this.offer = offer));
  }

  deleteOffer(offerId: number) {
    this.offerService
      .deleteOffer(offerId)
      .subscribe((offer) => this.router.navigateByUrl('/offers'));
  }
}