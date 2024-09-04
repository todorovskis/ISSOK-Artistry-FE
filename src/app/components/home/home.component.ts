import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
}
