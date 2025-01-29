export type OrderRequest = {
  product_id: number;
  quantity: number;
  delivery_date: string; 
  price_per_unit: number;
  discount_rate?: number; 
  note?: string;          
};