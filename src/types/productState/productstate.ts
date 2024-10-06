import { IProductFrontend } from "./product.type";

export interface ProductState {
  isLoading: boolean;
  categories: Category[];
  MappedCategoriesWithImage:mappedCategory[];
  products: IProductFrontend[];
  searchedProducts:IProductFrontend[];
  singleProduct:IProductFrontend | null;
  productsByIds:IProductFrontend[];
  topRated:IProductFrontend[];

}
interface mappedCategory{
  category:string;
  image:string;
}
interface Subcategory {
  subcategory: string;
  childcategories: string[];
}
interface Category {
  category: string;
  subcategories: Subcategory[];
}
