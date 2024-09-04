import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'services/user-service';
import { Country } from 'app/interfaces/country';
import { Error } from 'app/interfaces/error';
import { Category } from 'app/interfaces/category';
import { NavigationComponent } from '../navigation/navigation.component';
import { DataService } from 'services/data-service';

@Component({
  selector: 'register-artist',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationComponent],
  templateUrl: './register-artist.component.html',
})
export class RegisterArtistComponent implements OnInit {

  registrationForm!: FormGroup;
  countries: Country[] = [];
  categories: Category[] = [];
  selectedCategories: string[] = [];
  errors: Error | undefined;
  isSubmitted: boolean = false;
  passwordsMatch: boolean = false;
  profilePicture: File | undefined;
  portfolio: File | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      profilePicture: [null, Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      country: ['', Validators.required],
      categories: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      hourlyRate: ['', [Validators.required, Validators.max(500)]],
      summary: ['', Validators.required],
      jobTitle: ['', Validators.required],
      portfolio: ['', Validators.required]
    });

    this.dataService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries = data;
      }
    );
    this.dataService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      }
    );
  }

  onProfilePictureChange(event: any) {
    this.profilePicture = event.target.files[0] as File;
  }

  onPortfolioChange(event: any) {
    this.portfolio = event.target.files[0] as File;
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.registrationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
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

  onSubmit() {
    this.isSubmitted = true;
    console.log(this.isSubmitted);

    this.passwordsMatch = this.registrationForm.get('password')?.value === this.registrationForm.get('confirmPassword')?.value;
    console.log(this.findInvalidControls());

    if (this.registrationForm.invalid || !this.passwordsMatch) {
      return;
    }

    if (!this.profilePicture || !this.portfolio) {
      return;
    }

    console.log(this.registrationForm.get('categories'))


    const formData = new FormData();
    formData.append('username', this.registrationForm.get('username')?.value);
    formData.append('password', this.registrationForm.get('password')?.value);
    formData.append('confirmPassword', this.registrationForm.get('confirmPassword')?.value);
    formData.append('name', this.registrationForm.get('name')?.value);
    formData.append('country', this.registrationForm.get('country')?.value);
    formData.append('age', this.registrationForm.get('age')?.value);
    formData.append('hourlyRate', this.registrationForm.get('hourlyRate')?.value);
    formData.append('summary', this.registrationForm.get('summary')?.value);
    formData.append('jobTitle', this.registrationForm.get('jobTitle')?.value);
    formData.append('categories', JSON.stringify(this.selectedCategories));
    formData.append('profilePicture', this.profilePicture, this.profilePicture.name);
    formData.append('portfolio', this.portfolio, this.portfolio.name);

    this.authService.registerArtist(formData).subscribe({
      next: (value) => {
        if (value) {
          this.router.navigateByUrl("/");
        }
      },
      error: (err) => {
        this.errors = { messages: err.error.errors };
      }
    });
  }
}
