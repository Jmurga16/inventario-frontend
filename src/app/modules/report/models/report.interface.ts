import { Product } from '../../product/models';

export interface LowStockReportData {
  generatedAt: string;
  totalProducts: number;
  products: Product[];
}
