import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from 'services/user-service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'navigation',
  standalone: true,
  imports: [RouterLink, SearchComponent],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {

  isUserLoggedIn: boolean | undefined
  userRole: string | undefined
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole()
    this.authService.isUserLoggedIn()
      .subscribe(
        value => this.isUserLoggedIn = value
      )
  }

  getUsername() {
    return this.authService.getUsernameForUser()
  }

  logout() {
    this.authService.logout()
  }

  search(){

  }
}
