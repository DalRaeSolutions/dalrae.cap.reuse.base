using { dalrae.cap.reuse.base as schema } from '../db/schema';

/** For serving end users */
service AdminService @(path:'/admin', requires: 'authenticated-user') {

  entity Orders @(restrict: [ 
    { grant: 'READ', to: 'admin' },
  ]) as projection on schema.Orders;

  entity OrderItems @(restrict: [ 
    { grant: 'READ', to: 'admin' },
  ]) as projection on schema.OrderItems {
    *,
    order.customer as customer
  }

  entity Customers @(restrict: [ 
    { grant: '*', to: 'admin' },
  ]) as projection on schema.Customers
}