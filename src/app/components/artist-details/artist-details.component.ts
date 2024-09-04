import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'app/interfaces/artist';
import { ArtistService } from 'services/artist-service';
import { NavigationComponent } from '../navigation/navigation.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
// import { StarRatingComponent } from '../star-rating/star-rating.component';
import { ArtistReviewsComponent } from '../artist-reviews/artist-reviews.component';

@Component({
  selector: 'artist-details',
  standalone: true,
  imports: [NavigationComponent,ArtistReviewsComponent],
  templateUrl: './artist-details.component.html',
})
export class ArtistDetailsComponent implements OnInit {

  artist: Artist | undefined

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService) {

  }
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!
    this.artistService.getArtistById(id).subscribe(
      artist => {
        this.artist = artist
      },
      error => {
        console.error('Error fetching object details:', error);
      }
    )
  }


}
