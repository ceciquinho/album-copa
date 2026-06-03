export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Sticker {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  photo: string;
  collected: boolean;
  number: number;
}