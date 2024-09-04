import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

@Component({
  selector: 'offer-content',
  standalone: true,
  imports: [PdfJsViewerModule, NgIf, NgFor],
  templateUrl: './offer-content.component.html',
})
export class OfferContent implements OnChanges {

  @Input() offerContents: { url: string, artistUsername: string }[] = [];
  srcs: { url: string, artistUsername: string }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    console.log(this.offerContents);

    if (changes['offerContents']) {
      this.srcs = [];
      setTimeout(() => {
        this.srcs = changes['offerContents'].currentValue;
      }, 0); 
    }
  }

}
