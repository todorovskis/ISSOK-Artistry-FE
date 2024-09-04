import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'choose-role',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './choose-role.component.html',
})
export class ChooseRoleComponent {

  constructor(private router: Router) { }

  redirectToRegistration(role: string) {
    if (role === 'client')
      this.router.navigate(['/client-registration'])
    else this.router.navigate(['/artist-registration'])
  }

}
