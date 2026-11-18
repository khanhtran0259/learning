import dayjs from 'dayjs';

import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';

export interface ICustomerOrder {
  id?: number;
  orderCode?: string;
  orderDate?: dayjs.Dayjs;
  totalAmount?: number;
  status?: keyof typeof OrderStatus;
}

export const defaultValue: Readonly<ICustomerOrder> = {};
