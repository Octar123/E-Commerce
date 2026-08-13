import { Product } from './product.model';
import { UserData } from './user.model';

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  cartItems: CartItem[];
  currentUser: UserData;
}
