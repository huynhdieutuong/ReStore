using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
  public static class OrderExtensions
  {
    public static IQueryable<OrderDto> MapOrderToDto(this IQueryable<Order> query)
    {
      return query.Select(o => new OrderDto
      {
        Id = o.Id,
        BuyerId = o.BuyerId,
        ShippingAddress = o.ShippingAddress,
        OrderDate = o.OrderDate,
        Subtotal = o.Subtotal,
        DeliveryFee = o.DeliveryFee,
        OrderStatus = o.OrderStatus.ToString(),
        Total = o.GetTotal(),
        OrderItems = o.OrderItems.Select(i => new OrderItemDto
        {
          ProductId = i.ItemOrdered.ProductId,
          Name = i.ItemOrdered.Name,
          PictureUrl = i.ItemOrdered.PictureUrl,
          Price = i.Price,
          Quantity = i.Quantity
        }).ToList()
      }).AsNoTracking();
    }
  }
}