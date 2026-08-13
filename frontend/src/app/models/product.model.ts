export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imagePath: string | null;
  category?: string;
  isNew?: boolean;
  rating?: number;
  originalPrice?: number;
}

export interface ProductFilters {
  page?: number;
  search?: string;
  subCategoryId?: number | null;
  categoryId?: number | null;
  typeId?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export interface ProductSearchMetadata {
  currentPage: number;
  lastPage: number;
  total?: number;
}

export interface ProductSearchResponse {
  data: Product[];
  metadata: ProductSearchMetadata;
  currentUser?: unknown;
}
