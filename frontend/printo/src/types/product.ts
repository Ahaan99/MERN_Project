export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: {
    url: string;
    alt?: string;
  }[];
  colors: {
    name: string;
    hex: string;
  }[];
  sizes: string[];
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Design {
  productId: string;
  design: any; // fabric.js JSON
  color: string;
  size: string;
}

export interface CartItem {
  productId: string;
  designImage: string;
  color: string;
  size: string;
  quantity: number;
}
