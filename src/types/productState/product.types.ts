export interface ProductState {
  isLoading: boolean;
  categories: Category[];
}
interface Subcategory {
  subcategory: string;
  childcategories: string[];
}
interface Category {
  category: string;
  subcategories: Subcategory[];
}
