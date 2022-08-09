using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.OrderAggregate;

namespace API.Entities
{
  public class UserAddress : Address
  {
    public string Id { get; set; }
    public UserAddress() { }

    public UserAddress(ShippingAddress shippingAddress)
    {
      FullName = shippingAddress.FullName;
      Address1 = shippingAddress.Address1;
      Address2 = shippingAddress.Address2;
      City = shippingAddress.City;
      State = shippingAddress.State;
      Zip = shippingAddress.Zip;
      Country = shippingAddress.Country;
    }
  }
}