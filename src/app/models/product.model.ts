export interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  type: 'manga' | 'comic';
}

export interface CartItem extends Product {
  quantity: number;
}