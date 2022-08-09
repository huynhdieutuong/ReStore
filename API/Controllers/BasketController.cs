using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  public class BasketController : BaseApiController
  {
    private readonly StoreContext _context;
    private readonly UserManager<User> _userManager;
    public BasketController(StoreContext context, UserManager<User> userManager)
    {
      _context = context;
      _userManager = userManager;
    }

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
      var basket = await RetrieveBasket();

      if (basket == null) return NotFound();

      return basket.MapBasketToDto();
    }

    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
      var basket = await RetrieveBasket();
      if (basket == null) basket = await CreateBasket();

      var product = await _context.Products.FindAsync(productId);
      if (product == null) return NotFound();

      basket.AddItem(product, quantity);

      var result = await _context.SaveChangesAsync() > 0;
      if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

      return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
    }

    [HttpDelete]
    public async Task<ActionResult<BasketDto>> RemoveBasketItem(int productId, int quantity)
    {
      var basket = await RetrieveBasket();
      if (basket == null) return NotFound();

      basket.RemoveItem(productId, quantity);

      var result = await _context.SaveChangesAsync() > 0;
      if (result) return Ok();

      return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });
    }

    private async Task<Basket> RetrieveBasket()
    {
      var userId = Request.Cookies["buyerId"];
      if (User.Identity.IsAuthenticated)
      {
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        userId = user.Id;
      }

      return await _context.Baskets.RetrieveBasketWithItems(userId).FirstOrDefaultAsync();
    }

    private async Task<Basket> CreateBasket()
    {
      var buyerId = string.Empty;

      if (User.Identity.IsAuthenticated)
      {
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        buyerId = user.Id;
      }
      else
      {
        buyerId = Guid.NewGuid().ToString();

        var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
        Response.Cookies.Append("buyerId", buyerId, cookieOptions);
      }

      var basket = new Basket { BuyerId = buyerId };
      _context.Baskets.Add(basket);

      return basket;
    }
  }
}