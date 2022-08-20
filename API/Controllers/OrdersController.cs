using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [Authorize]
  public class OrdersController : BaseApiController
  {
    private readonly StoreContext _context;
    private readonly UserManager<User> _userManager;
    public OrdersController(StoreContext context, UserManager<User> userManager)
    {
      _context = context;
      _userManager = userManager;
    }

    [HttpGet]
    public async Task<List<OrderDto>> GetOrders()
    {
      var user = await _userManager.FindByNameAsync(User.Identity.Name);

      return await _context.Orders
              .MapOrderToDto()
              .Where(o => o.BuyerId == user.Id)
              .ToListAsync();
    }

    [HttpGet("{id}", Name = "GetOrder")]
    public async Task<OrderDto> GetOrder(int id)
    {
      var user = await _userManager.FindByNameAsync(User.Identity.Name);

      return await _context.Orders
              .MapOrderToDto()
              .FirstOrDefaultAsync(o => o.BuyerId == user.Id && o.Id == id);
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateOrder(CreateOrderDto createOrderDto)
    {
      var user = await _userManager.Users
              .Include(u => u.Address)
              .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

      var userBasket = await _context.Baskets.RetrieveBasketWithItems(user.Id).FirstOrDefaultAsync();

      if (userBasket == null) return BadRequest(new ProblemDetails { Title = "Basket not found" });

      var orderItems = new List<OrderItem>();

      foreach (var item in userBasket.Items)
      {
        var itemOrdered = new ProductItemOrdered
        {
          ProductId = item.ProductId,
          Name = item.Product.Name,
          PictureUrl = item.Product.PictureUrl
        };

        var orderItem = new OrderItem
        {
          ItemOrdered = itemOrdered,
          Price = item.Product.Price,
          Quantity = item.Quantity
        };

        orderItems.Add(orderItem);
        item.Product.QuantityInStock -= item.Quantity;
      }

      var subtotal = orderItems.Sum(item => item.Price * item.Quantity);
      var deliveryFee = subtotal > 10000 ? 0 : 500;

      var order = new Order
      {
        BuyerId = user.Id,
        ShippingAddress = createOrderDto.ShippingAddress,
        OrderItems = orderItems,
        Subtotal = subtotal,
        DeliveryFee = deliveryFee,
        PaymentIntentId = userBasket.PaymentIntentId
      };

      _context.Orders.Add(order);
      _context.Baskets.Remove(userBasket);

      if (createOrderDto.IsSaveAddress)
      {
        user.Address = new UserAddress(createOrderDto.ShippingAddress);
      }

      var result = await _context.SaveChangesAsync() > 0;
      if (result) return CreatedAtRoute("GetOrder", new { Id = order.Id }, order.Id);

      return BadRequest(new ProblemDetails { Title = "Problem creating order" });
    }
  }
}