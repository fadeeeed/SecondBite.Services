export interface ICreateUser {
  user_name: string;
  email: string;
  password: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  contact_number?: string;
  address?: string;
  location_longitude?: number;
  location_latitude?: number;
}

export interface IUpdateUser {
  password?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  contact_number?: string;
  address?: string;
  location_longitude?: number;
  location_latitude?: number;
}

export interface User {
  user_name: string;
  email: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  contact_number?: string;
  address?: string;
  location_longitude?: number;
  location_latitude?: number;
}
