using { dalrae.cap.reuse.base as schema } from '../db/schema';

/** For serving end users */
service AdminService @(path:'/admin') {
  entity Orders as projection on schema.Orders;
  entity Customers as projection on schema.Customers
}