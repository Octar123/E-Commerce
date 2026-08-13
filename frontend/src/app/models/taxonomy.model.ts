export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  subCategories?: SubCategory[];
}

export interface Type {
  id: number;
  name: string;
  categories?: Category[];
}

export interface TaxonomyResponse {
  types: Type[];
  currentUser?: unknown;
}
