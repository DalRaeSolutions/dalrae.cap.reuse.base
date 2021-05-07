using { Currency, managed, cuid } from '@sap/cds/common';

namespace dalrae.cap.reuse.base;

entity Orders : cuid, managed {
  description: String;
  customer: Association to one Customers;
  items: Composition of many OrderItems on items.order = $self;
}

entity OrderItems: cuid, managed {
  order: Composition of one Orders;
  item: String;
  quantity: Double; 
  price: Double;
  currency: Currency; 
}

entity Customers : cuid, managed {
  name: String;
  orders: Composition of many Orders on orders.customer = $self;
}