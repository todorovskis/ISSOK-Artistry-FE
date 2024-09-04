import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Offer } from 'app/interfaces/offer';
import { OfferService } from 'services/offer-service';
import { NavigationComponent } from '../navigation/navigation.component';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'services/user-service';
import { Category } from 'app/interfaces/category';
import { DataService } from 'services/data-service';

@Component({
  selector: 'update-offer',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationComponent],
  templateUrl: './update-offer.component.html',
  styleUrl: './update-offer.component.css',
})
export class UpdateOfferComponent implements OnInit {
  offer: Offer | undefined;
  updateOfferForm: FormGroup;
  categories: Category[] = [];
  selectedCategories: string[] = [];
  errors: Error | undefined;

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private dataService: DataService
  ) {
    this.updateOfferForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.dataService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });

    const controlOptions: AbstractControlOptions = { updateOn: 'submit' };
    const offerId = +this.route.snapshot.paramMap.get('id')!;
    this.offerService.getOffer(offerId).subscribe((offer) => {
      this.offer = offer;
      this.selectedCategories = offer.categories;
    });

    this.updateOfferForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      categories: ['', Validators.required],
    });
  }
  findInvalidControls() {
    const invalid = [];
    const controls = this.updateOfferForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  //problem with the way the array of categories is sent
  onSubmit() {
    const formData = new FormData();

    formData.append('id', this.offer?.id.toString()!);
    if (this.updateOfferForm.get('title')?.invalid) {
      formData.append('title', this.offer?.title!);
    } else {
      formData.append('title', this.updateOfferForm.get('title')?.value);
    }
    if (this.updateOfferForm.get('description')?.invalid) {
      formData.append('description', this.offer?.description!);
    } else {
      formData.append(
        'description',
        this.updateOfferForm.get('description')?.value
      );
    }
    if (this.updateOfferForm.get('price')?.invalid) {
      formData.append('price', this.offer?.price.toString()!);
    } else {
      formData.append('price', this.updateOfferForm.get('price')?.value);
    }
    if (this.updateOfferForm.get('categories')?.invalid) {
      formData.append('categories', JSON.stringify(this.offer?.categories));
    } else {
      formData.append('categories', JSON.stringify(this.selectedCategories));
    }

    this.offerService
      .updateOffer(formData)
      .subscribe((offer) =>
        this.router.navigateByUrl(`/offers/details/${offer.id}`)
      );
  }

  onChange(value: string) {
    if (this.selectedCategories.includes(value)) {
      const index = this.selectedCategories.indexOf(value, 0);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    } else {
      this.selectedCategories.push(value);
    }
  }
}
