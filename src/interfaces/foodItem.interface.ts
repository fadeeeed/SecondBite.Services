export interface ICreateFoodItem {
  name: string;
  description?: string;
  quantity: number;
  expiry_date: Date;
  dietary_restrictions?: string;
  image_url: string;
}

export interface IUpdateFoodItem {
  name?: string;
  description?: string;
  quantity?: number;
  expiry_date?: Date;
  dietary_restrictions?: string;
  image_url?: string;
}
