import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArtistReviewsComponent } from '../artist-reviews/artist-reviews.component';

@Component({
  selector: 'review-dialog',
  standalone: true,
  imports: [],
  templateUrl: './review-dialog.component.html',
})
export class ReviewDialogComponent {
  @Input() artistId: number | undefined;

  constructor(public dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(ArtistReviewsComponent, {
      data: { artistId: this.artistId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}