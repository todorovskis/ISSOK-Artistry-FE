export interface ArtistRegistrationRequest {
    username: string;
    password: string;
    confirmPassword: string;
    name: string;
    country: string;
    age: number;
    hourlyRate: number;
    jobTitle: string;
    summary: string;
    categories: string[];
}