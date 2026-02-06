export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;

    rating: {
        rate: number;
        count: number;
    };
    quantity: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc' | 'default';