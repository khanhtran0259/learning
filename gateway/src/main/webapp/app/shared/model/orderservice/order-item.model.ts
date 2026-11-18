import { ICustomerOrder } from 'app/shared/model/orderservice/customer-order.model';

export interface IOrderItem {
  id?: number;
  productId?: number;
  productName?: string;
  price?: number;
  quantity?: number;
  order?: ICustomerOrder | null;
}

export const defaultValue: Readonly<IOrderItem> = {};
