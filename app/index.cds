using AdminService from '../srv/admin';

annotate AdminService.Orders with @(UI : {
  HeaderInfo : {
    TypeName       : 'Order',
    TypeNamePlural : 'Orders',
    Title          : {Value : description}
  },
  LineItem   : {$value : [
    {
      Value : ID,
      Label : 'Order ID'
    },
    {
      Value : description,
      Label : 'Description'
    },
    {
      Value : createdBy,
      Label : 'Ordered by'
    },
    {
      Value : createdAt,
      Label : 'Ordered on'
    }
  ]}
});