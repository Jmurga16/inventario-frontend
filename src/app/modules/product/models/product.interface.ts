export interface Product {
    id: number;
    sku: string;
    name: string;
    description?: string;
    categoryId: number;
    categoryName?: string;
    unitPrice: number;
    cost?: number;
    quantity: number;
    minStock: number;
    maxStock?: number;
    isActive: boolean;
    isLowStock: boolean;
    isOutOfStock: boolean;
    createdAt: string;
}

export interface CreateProductDto {
    sku?: string;
    name?: string;
    description?: string;
    categoryId: number;
    unitPrice: number;
    cost?: number;
    quantity: number;
    minStock?: number;
    maxStock?: number;
}

export interface UpdateProductDto {
    name?: string;
    description?: string;
    categoryId: number;
    unitPrice: number;
    quantity: number;
    cost?: number;
    minStock: number;
    maxStock?: number;
    isActive: boolean;
}
