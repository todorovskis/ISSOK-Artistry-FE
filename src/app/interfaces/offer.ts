import { ArtistBrief } from "./artist-brief";

export interface Offer {
    id: number;
    title: string;
    description: string;
    timeCreated: string;
    price: number;
    categories: string[];
    artistsSignedUp: ArtistBrief[];
    status: string;
    clientUsername: string;
    contentLocations: { url: string, artistUsername: string }[];  
    clientProfilePicture: string;
    mode: string,
    offerGeneratedImage: string
}