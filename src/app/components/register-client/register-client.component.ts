import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientRegistrationRequest } from 'app/interfaces/client-registration';
import { AuthService } from 'services/user-service';
import { NavigationComponent } from '../navigation/navigation.component';
import { Country } from 'app/interfaces/country';
import { Error } from 'app/interfaces/error';
import { DataService } from 'services/data-service';

@Component({
  selector: 'register-client',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationComponent],
  templateUrl: './register-client.component.html',
})
  export class RegisterClientComponent implements OnInit {

    client: ClientRegistrationRequest | undefined
    registrationForm: FormGroup
    countries: Country[] = []
    errors: Error | undefined
    isSubmitted: boolean = false
    passwordsMatch: boolean = false
    profilePicture: File | undefined;

    constructor(private formBuilder: FormBuilder,
      private authService: AuthService,
      private dataService: DataService,
      private router: Router
    ) { this.registrationForm = new FormGroup({}) }

    ngOnInit(): void {
      console.log(this.isSubmitted);

      const controlOptions: AbstractControlOptions = { updateOn: 'submit' };

      this.registrationForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        name: ['', Validators.required],
        country: ['', Validators.required],
        profilePicture: [null, Validators.required],
      }, controlOptions)

      this.dataService.getCountries().subscribe(
        (data: Country[]) => {
          console.log(data);
          this.countries = data
        }
      )
    }

    onProfilePictureChange(event: any) {
      this.profilePicture = event.target.files[0] as File;
    }

    onSubmit() {
      console.log(this.isSubmitted);
      
      this.isSubmitted = true;
      this.passwordsMatch = this.registrationForm.get('password')?.value == this.registrationForm.get('confirmPassword')?.value;
      if (this.registrationForm.invalid || !this.passwordsMatch)
        return;

      if (!this.profilePicture) {
        return;
      }

      const formData = new FormData();
      formData.append('username', this.registrationForm.get('username')?.value);
      formData.append('password', this.registrationForm.get('password')?.value);
      formData.append('confirmPassword', this.registrationForm.get('confirmPassword')?.value);
      formData.append('name', this.registrationForm.get('name')?.value);
      formData.append('country', this.registrationForm.get('country')?.value);
      formData.append('profilePicture', this.profilePicture, this.profilePicture.name);

      this.authService.registerClient(formData)
        .subscribe({
          next: (value) => {
            if (value) {
              this.router.navigateByUrl("/");
            }
          },
          error: (err) => {
            this.errors = { messages: err.error.errors };
          }
        }
        )

    }
}
