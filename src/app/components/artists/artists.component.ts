import { Component, OnInit } from '@angular/core';
import { Artist } from 'app/interfaces/artist';
import { ArtistService } from 'services/artist-service';
import { NavigationComponent } from '../navigation/navigation.component';
import '@fortawesome/fontawesome-free';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Category } from 'app/interfaces/category';
import { DataService } from 'services/data-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { ProgressSpinner } from '../progress-spinner/progress-spinner.component';

@Component({
  selector: 'artists',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NavigationComponent,
    ReviewDialogComponent,
    ProgressSpinner,
  ],
  templateUrl: './artists.component.html',
})
export class ArtistsComponent implements OnInit {
  searchQuery: string = '';
  artists: Artist[] = [];
  selectedCategories: Category[] = [];
  loading: boolean = true;
  filterForm: FormGroup;
  categories: Category[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private categoryService: DataService
  ) {
    this.filterForm = this.formBuilder.group({
      minPrice: [this.minPrice],
      maxPrice: [this.maxPrice],
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          if (params && 'q' in params) {
            this.searchQuery = params.q || '';
            return this.artistService.getAllBySearchInput(this.searchQuery);
          } else {
            this.searchQuery = '';
            return this.artistService.getAllArtists();
          }
        })
      )
      .subscribe((results) => {
        this.artists = results;
        this.setLoadingWithDelay(false);
      });

    this.categoryService.getCategories().subscribe((results) => {
      this.categories = results;
      this.createFilterForm();
    });
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
  createFilterForm() {
    const formControls: { [key: string]: any } = this.filterForm.controls;
    this.categories.forEach((category) => {
      formControls[category.category] = false;
    });

    this.filterForm = this.formBuilder.group(formControls);

    console.log(this.filterForm);

    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((values) => {
          var minPrice: number = 0;
          var maxPrice: number = 500;
          const selectedCategories: string[] = [];

          if (values.minPrice) minPrice = values.minPrice;
          else minPrice = 0;

          if (values.maxPrice) maxPrice = values.maxPrice;
          else maxPrice = 500;

          Object.keys(values).forEach((key) => {
            if (key != 'minPrice' && key != 'maxPrice') {
              if (values[key]) {
                selectedCategories.push(key);
              }
            }
          });

          if (selectedCategories.length <= 0)
            return this.artistService.getAllByPriceRange(minPrice, maxPrice);

          return this.artistService.getAllByCategoriesAndPriceRange(
            selectedCategories,
            minPrice,
            maxPrice
          );
        })
      )
      .subscribe((artists) => {
        this.artists = artists;
        this.setLoadingWithDelay(false);
      });
  }
}
