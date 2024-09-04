import {Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'progress-spinner',
  templateUrl: 'progress-spinner.component.html',
  styleUrl: 'progress-spinner.component.css',
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
export class ProgressSpinner {}
