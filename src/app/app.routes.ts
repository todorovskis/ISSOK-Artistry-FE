import {Routes} from '@angular/router';
import {UserDetailsComponent} from './components/user-details/user-details.component';
import {registerLocaleData} from '@angular/common';
import {RegisterClientComponent} from './components/register-client/register-client.component';
import {RegisterArtistComponent} from './components/register-artist/register-artist.component';
import {HomeComponent} from './components/home/home.component';
import {ChooseRoleComponent} from './components/choose-role/choose-role.component';
import {ArtistsComponent} from './components/artists/artists.component';
import {LoginComponent} from './components/login/login.component';
import {OffersComponent} from './components/offers/offers.component';
import {AuthenticationGuard} from './guards/authentication.guard';
import {ArtistDetailsComponent} from './components/artist-details/artist-details.component';
import {PortfolioComponent} from './components/portfolio/portfolio.component';
import {OfferDetailsComponent} from './components/offer-details/offer-details.component';
import {CreateOfferComponent} from './components/create-offer/create-offer.component';
import {ArtistSignedUpOffersComponent} from './components/artist-signed-up-offers/artist-signed-up-offers.component';
import {UpdateOfferComponent} from './components/update-offer/update-offer.component';
import {ImageGeneratorComponent} from "./components/image-generator/image-generator.component";

export const routes: Routes = [
  {
    path: 'choose-role',
    component: ChooseRoleComponent,
  },
  {
    path: 'client-registration',
    component: RegisterClientComponent
  },
  {
    path: 'artist-registration',
    component: RegisterArtistComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    component: UserDetailsComponent
  },
  {
    path: 'artists',
    component: ArtistsComponent
  },
  {
    path: 'artists/:id',
    component: ArtistDetailsComponent
  },
  {
    path: 'offers/update/:id',
    component: UpdateOfferComponent
  },
  {
    path: 'offers',
    component: OffersComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'uploads/portfolio/:id',
    component: PortfolioComponent,
  },
  {
    path: 'offers/details/:id',
    component: OfferDetailsComponent
  },
  {
    path: 'create-offer',
    component: CreateOfferComponent
  },
  {
    path: 'signed-up-offers',
    component: ArtistSignedUpOffersComponent
  },
  {
    path: 'generate-image',
    component: ImageGeneratorComponent
  },
  {
    path: '**',
    component: HomeComponent
  },
];
