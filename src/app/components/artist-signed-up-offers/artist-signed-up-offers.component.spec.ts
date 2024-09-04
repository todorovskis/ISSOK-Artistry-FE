import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistSignedUpOffersComponent } from './artist-signed-up-offers.component';

describe('ArtistSignedUpOffersComponent', () => {
  let component: ArtistSignedUpOffersComponent;
  let fixture: ComponentFixture<ArtistSignedUpOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistSignedUpOffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistSignedUpOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
