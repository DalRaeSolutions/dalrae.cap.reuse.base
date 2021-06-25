using {
  Currency,
  managed,
  cuid
} from '@sap/cds/common';

namespace dalrae.cap.reuse.base;

entity Orders : cuid, managed {
  description : String;
  customer    : Association to one Customers;
}

entity Customers : cuid, managed {
  name   : String;
  orders : Composition of many Orders
             on orders.customer = $self;
}