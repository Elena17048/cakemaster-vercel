import { Timestamp } from 'firebase/firestore';

export type OrderStatus =
  | 'new'
  | 'awaiting_payment'
  | 'paid'
  | 'done';

export type Customer = {
  name?: string;
  email?: string;
  phone?: string;
};

export type Order = {
  id: string;

  // core
  status: OrderStatus;
  amount: number;

  // cake
  flavor: string;
  size: string;
  shape?: string;
  plaqueText?: string;

  // dates
  createdAt?: Timestamp;
  pickupDate?: string;

  // customer
  customer?: Customer;
};
