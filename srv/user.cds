using { dalrae.cap.reuse.base as schema } from '../db/schema';

service CustomerService @(path:'/customer', requires: 'authenticated-user') {

  entity Orders @(restrict: [ 
    { grant: '*', to: 'customer', where: 'customer_ID like $user.customer' },
  ]) as projection on schema.Orders;

  entity OrderItems @(restrict: [ 
    { grant: '*', to: 'customer', where: 'customer_ID like $user.customer' },
  ]) as projection on schema.OrderItems {
    *,
    order.customer as customer
  }

  entity Customers @(restrict: [ 
    { grant: 'READ', to: 'customer', where: 'ID like $user.customer' },
  ]) as projection on schema.Customers
}