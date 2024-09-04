import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'services/user-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup = new FormGroup({});
  isSubmitted = false;
  errorMessage: string | undefined;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid)
      return;

    this.authService.login(this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value).subscribe({
        next: value => {
          if (value) {
            this.router.navigateByUrl("/");
          }
        }, error: err => {
          this.errorMessage = "Invalid credentials. Try again."
        }
      })
  }
}
