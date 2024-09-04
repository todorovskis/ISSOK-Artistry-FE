import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Review } from 'app/interfaces/review';
import { ReviewService } from 'services/review-service';

@Component({
  selector: 'artist-reviews',
  standalone: true,
  imports: [],
  templateUrl: './artist-reviews.component.html',
})
export class ArtistReviewsComponent implements OnInit {
  @Input() artistId: number | undefined;
  reviews: Review[] = [];

  constructor(
    private reviewService: ReviewService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { artistId: number }
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.artistId) {
      this.artistId = this.data.artistId;
    }    

    if (this.artistId) {
      this.reviewService.getReviewsByArtist(this.artistId).subscribe(
        reviews => { this.reviews = reviews; console.log(reviews); }
      );
    }
  }

}
