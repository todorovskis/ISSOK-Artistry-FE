import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileUploaded } from 'app/interfaces/portfolio';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ArtistService } from 'services/artist-service';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'portfolio',
  standalone: true,
  imports: [PdfJsViewerModule, NavigationComponent],
  templateUrl: './portfolio.component.html',
})
export class PortfolioComponent implements OnInit {

  portfolio: FileUploaded | undefined;
  artistId: number | undefined;

  constructor(private route: ActivatedRoute,
    private artistService: ArtistService
  ) { }

  ngOnInit(): void {
    this.artistId = +this.route.snapshot.paramMap.get('id')!
    this.artistService.getArtistPortfolioById(this.artistId)
      .subscribe(url => {
        if(url.path)
        this.portfolio = url})
  }

}
