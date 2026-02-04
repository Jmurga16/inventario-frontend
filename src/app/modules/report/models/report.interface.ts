import { Product } from '../../product/models';

export interface LowStockReportData {
  GeneratedAt: string;
  TotalProducts: number;
  Products: Product[];
}
