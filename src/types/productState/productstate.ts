import { IProductFrontend } from "./product.type";

export interface ProductState {
  isLoading: boolean;
  categories: Category[];
  products: IProductFrontend[];
}
interface Subcategory {
  subcategory: string;
  childcategories: string[];
}
interface Category {
  category: string;
  subcategories: Subcategory[];
}
