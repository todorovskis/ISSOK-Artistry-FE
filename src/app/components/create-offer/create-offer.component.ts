import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'app/interfaces/category';
import { OfferService } from 'services/offer-service';
import { DataService } from 'services/data-service';
import { ImageGeneratorComponent } from '../image-generator/image-generator.component';
//import { ImageDrawingComponent } from 'ngx-image-drawing';

@Component({
  selector: 'create-offer',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationComponent, ImageGeneratorComponent],
  templateUrl: './create-offer.component.html',
})
export class CreateOfferComponent implements OnInit {
  createOfferForm: FormGroup
  categories: Category[] = []
  selectedCategories: string[] = []
  errors: Error | undefined;
  isSubmitted = false;
  selectedImage?: string;

  constructor(private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private offerService: OfferService
  ) { this.createOfferForm = new FormGroup({}) }

  ngOnInit(): void {
    this.createOfferForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.max(500)]],
      tournament: [''],
      categories: ['', Validators.required]
    })

    this.dataService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data
      }
    )

  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.createOfferForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  onSubmit() {
    this.isSubmitted = true;

    console.log('create-offer form submit')
    console.log(this.findInvalidControls())
    if (this.createOfferForm.invalid) return

    const formData = new FormData()
    formData.append('title', this.createOfferForm.get('title')?.value)
    formData.append('description', this.createOfferForm.get('description')?.value)
    formData.append('price', this.createOfferForm.get('price')?.value)
    formData.append('categories', JSON.stringify(this.selectedCategories))
    formData.append('status', "PENDING")
    formData.append('timeCreated', (Date.now()).toString())
    formData.append('tournament', this.createOfferForm.get('tournament')?.value ? 'true' : 'false');

    if (this.selectedImage) {
      formData.append('selectedImageUrl', this.selectedImage); }

    this.offerService.createOffer(formData).subscribe({
      next: (value) => {
        if (value) {
          this.router.navigateByUrl("/offers")
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  onChange(value: string) {
    if (this.selectedCategories.includes(value)) {
      const index = this.selectedCategories.indexOf(value, 0);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    } else {
      this.selectedCategories.push(value)
    }
  }

  handleImageSelection(imageUrl: string) {
    this.selectedImage = imageUrl; 
  }
}