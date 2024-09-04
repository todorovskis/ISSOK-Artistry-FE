import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';
import { Offer } from 'app/interfaces/offer';
import { OfferService } from 'services/offer-service';
import { AuthService } from 'services/user-service';
import { NavigationComponent } from '../navigation/navigation.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinner } from '../progress-spinner/progress-spinner.component';

@Component({
  selector: 'offers',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationComponent, ProgressSpinner],
  templateUrl: './offers.component.html',
})
export class OffersComponent implements OnInit {
  searchQuery: string = '';
  offers: Offer[] = [];
  userOffers: Offer[] = [];
  onlyMyOffers: boolean = false;
  username: string | undefined;
  userRole: string | undefined;
  myOffers: Boolean = false;
  signedUpOffers: Offer[] = [];
  workingOnOffers: Offer[] = [];
  onlyMyOffersForm: FormGroup = new FormGroup({});
  loading: boolean = true

  allOffers: Offer[] = [];
  priceForm: FormGroup;

  showOnlyUserOffers: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.priceForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.username = this.authService.getUsernameForUser()
    this.userRole = this.authService.getUserRole()

    if (this.username && this.userRole == "ARTIST") {
      this.offerService.getWorkingOnoffersForArtist(this.username).subscribe(
        workingOnOffers => this.workingOnOffers = workingOnOffers
      )
      this.offerService.getSignedUpOffersForArtist(this.username).subscribe(
        signedUpOffers => this.signedUpOffers = signedUpOffers
      )
    }

    this.route.queryParams.pipe(
      switchMap(params => {
        if (params && 'q' in params) {
          this.searchQuery = params.q || '';
          console.log("query");

          console.log(this.myOffers);
          return this.offerService.getAllOffersBySearchInput(this.searchQuery);
        } else {
          this.searchQuery = '';
          return this.offerService.getOffers();
        }
      })
    ).subscribe(results => {
      this.offers = results;
      this.offers.forEach(offer => {
          if (offer.clientUsername == this.username) {
            this.userOffers.push(offer)
          }
        }
      )
      this.setLoadingWithDelay(false);
    });
    this.createPriceForm();

  }

  createPriceForm() {
    this.priceForm = this.formBuilder.group({
      minPrice: [],
      maxPrice: [],
    });

    this.priceForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((values) => {
          var minPrice: number = 0;
          var maxPrice: number = 500;

          if (values.minPrice) {
            minPrice = values.minPrice;
          }
          if (values.maxPrice) maxPrice = values.maxPrice;

          return this.offerService.getAllByPriceRange(minPrice, maxPrice);
        })
      )
      .subscribe((offers) => {
        this.offers = offers;
      });
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
        .subscribe((signedUpOffers) => {
          this.signedUpOffers = signedUpOffers;
        });
    }
  }

  private setLoadingWithDelay(loading: boolean = true) {
    if (loading) {
      this.loading = true;
    } else {
      setTimeout(() => {
        this.loading = false;
      }, 250);
    }
  }

  getUserOffers(val: boolean) {
    this.myOffers = val;
    if (this.myOffers) {
      this.offerService
        .getOffersForClient(this.username!)
        .subscribe((offers) => {
            this.offers = offers;
          }
        )
    } else {
      this.offerService
        .getOffers()
        .subscribe((offers) => (this.offers = offers));
    }
    console.log("function");

    console.log(this.myOffers);
  }

  selectViewAllOffers() {
    this.showOnlyUserOffers = false;
  }
  selectViewUserOffers() {
    this.showOnlyUserOffers = true;
  }
  isArtistSignedUpToOffer(offer: Offer): boolean {
    for (var signedUpOffer of this.signedUpOffers) {
      if (offer.id === signedUpOffer.id) {
        return true;
      }
    }
    return false;
  }

  isArtistWorkingOnOffer(offer: Offer): boolean {
    for (var workingOffer of this.workingOnOffers) {
      if (offer.id === workingOffer.id) {
        return true;
      }
    }
    return false;
  }
}
