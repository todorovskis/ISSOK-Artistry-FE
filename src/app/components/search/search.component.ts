import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';
import { AuthService } from 'services/user-service';

@Component({
  selector: 'search',
  standalone: true,
  imports: [ReactiveFormsModule, NavigationComponent],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  selectedCategory: string = 'artists';
  searchForm: FormGroup = new FormGroup({});
  isUserLoggedIn: boolean = false

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe(userLoggedIn => this.isUserLoggedIn = userLoggedIn)

    this.searchForm = this.formBuilder.group({
      query: ['',],
      category: ['artists',]
    })
  }

  onSubmit() {
    this.searchQuery = this.searchForm.get('query')?.value
    this.selectedCategory = this.searchForm.get('category')?.value

    if (this.selectedCategory === 'artists')
      this.router.navigate([`/artists`], { queryParams: { q: this.searchQuery } });
    else this.router.navigate([`/offers`], { queryParams: { q: this.searchQuery } });
  }

}
